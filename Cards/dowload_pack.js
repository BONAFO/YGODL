const manifiest = require('./manifiest.temp.json');

const { default: axios } = require("axios");
// const { raw } = require("./Raw");
const {  search, stringTOhtml } = require("./html");

const fs = require("fs");
const { exit , argv} = require("process");




const MainFolder = "./DB/";
const MainFolderImgs = MainFolder + "Images/";
const Cards = MainFolderImgs + "Cards/";
const Pack = MainFolderImgs + "Packs/";




const GET_CARD_IMG = async(card, toSave) => {
    const query = "yugioh_duel_links_" + card;
    const url = `https://www.bing.com/images/search?q=${query}&qs=n&form=QBIR&sp=-1&lq=0&pq=${query}&sc=10-6&cvid=4DFAC9330B0E41E8B743AE0F0A1EE6BB&ghsh=0&ghacc=0&first=1`;

    const res = (await (axios.get(url))).data


    // try {
    //     fs.mkdirSync(toSave + card + "/")
    // } catch (error) {

    // }



    // mimg
    const text = search(res, '<div id="vm_c">', 'id="fbdialog_title"');
    const dom = stringTOhtml(text).window.document;
    let content = dom.querySelectorAll("ul");
    const final = [];
    for (let i = 1; i < content.length; i++) {
        try {
            const links = content[i].querySelectorAll("li");
            for (let j = 0; j < 8; j++) {
                if (links[j] != undefined) {
                    final.push(links[j])
                }
            }
        } catch (error) {

        }

    }







    const urls = [];
    for (let i = 0; i < final.length; i++) {
        try {
            const img = final[i].getElementsByClassName("mimg");

            if (img.length != 0) {

                let url = img[0].src;
                let toDelete = [search(url, 'w=', "&c")[1], search(url, 'w=', "&c")[2] + 1];
                toDelete = url.substring(toDelete[0], toDelete[1]);
                url = url.replace(toDelete, "");
                urls.push(url)


                const output = toSave + card + "/" + card + "_" + i + ".png";

            }


        } catch (error) {

        }

    }


    return urls







}

function loadImage(src) {
    // return new Promise((resolve, reject) => {

    //     const dom = (stringTOhtml("<img/>")).window.document;
    
    //     const img = dom.querySelector("img");
        
    //     img.src = src;
    //     // img.onload = () => resolve({ success: true, url: src }); // Resuelve la promesa con un objeto que contiene `success` y `url`
    //     // img.onerror = () => resolve({ success: false, url: src }); // Resuelve la promesa con `success` como `false` si hay un error
    // });
}


async function downloadImage(url, outputPath) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Escribe la imagen en el archivo
        fs.writeFileSync(outputPath, response.data);
        console.log('Imagen descargada y guardada en', outputPath);
    } catch (error) {
        if (error.errors != undefined) {
            console.error('Error al descargar o guardar la imagen:', error.errors[0].errno);
        } else {
            console.error('Error al descargar o guardar la imagen:', error);

        }

    }
    


}
const get_card_description = async(cardName) => {

    cardName = cardName.replaceAll(" ", "_");
    const base = `https://yugioh.fandom.com/wiki/${cardName}`


    // const base = `https://www.google.com/search?q=${cardName}+description&sca_esv=981a0d32bcbf9b3f&hl=es&sxsrf=ADLYWIKz_sD6vJukefLRfl3iz0iEBHGybQ%3A1722871989272&ei=tfCwZseoEIHx1sQPiJOygQM&ved=0ahUKEwiH16enlt6HAxWBuJUCHYiJLDAQ4dUDCBA&uact=5&oq=Infernoble+Arms+-+Joyeuse+description&gs_lp=Egxnd3Mtd2l6LXNlcnAiJUluZmVybm9ibGUgQXJtcyAtIEpveWV1c2UgZGVzY3JpcHRpb25I4gNQAFgAcAB4AJABAJgBlAGgAZQBqgEDMC4xuAEDyAEA-AEC-AEBmAIAoAIAmAMAkgcAoAdZ&sclient=gws-wiz-serp`;
    try {
        const response = (await axios.get(base)).data;
        // let text = response.slice(response.indexOf('<table class="cardtable">'));

        const dom = stringTOhtml(response).window.document;
        let cardImage = dom.getElementsByClassName("cardtable-cardimage")[0].querySelector("img").src;
        cardImage = cardImage.replace(cardImage.substring(cardImage.indexOf("scale-to-width-down"), cardImage.indexOf("?")), "");



        const rows = dom.getElementsByClassName("cardtablerow");
        const cardData = {
            img: cardImage
        };
        let toSearch = ["Card type", 'Property', 'English', "Attribute",
            "Types",
            "Level",
            "ATK",
            "Link Arrows",
            'Pendulum Scale',
            "Rank"
        ];
        let rows_usefull = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];


            for (let j = 0; j < toSearch.length; j++) {
                if (row.outerHTML.includes(toSearch[j])) {
                    rows_usefull.push([row, toSearch[j]])
                    break;
                }

            }

        }





        for (let i = 0; i < rows_usefull.length; i++) {
            let row = rows_usefull[i][0].textContent;

            if (row.includes("English") && !row.includes("TCG sets")) {


                const lang_break = [
                    "French",
                    "German",
                    "Italian",
                    "Portuguese",
                    "Spanish",
                    "Japanese",
                    "Korean",

                ]

                const indexs = [row.indexOf("English"), (() => {
                    let end_index = -1;
                    for (let k = 0; k < lang_break.length; k++) {
                        end_index = row.indexOf(lang_break[k]);
                        if (end_index != -1) {
                            end_index -= lang_break[k].length
                            break
                        }

                    }
                    return end_index
                })()];



                if (!cardData["description"]) {
                    cardData["description"] = row.slice(indexs[0], indexs[1]).replace("English", "").trim();
                }

            } else if (!row.includes("TCG sets")) {
                switch (rows_usefull[i][1]) {
                    case "Card type":
                        cardData["type"] = row.replace("Card type", "").trim();
                        break;


                    case "Property":
                        cardData["types"] = row.replace("Property", "").trim();
                        break;
                    case "Pendulum Scale":
                        cardData["pendulum_scale"] = parseInt(row.replace("Pendulum Scale", "").trim());
                        break;


                    case "Attribute":
                        if (cardData["attibute"] == undefined) {
                            cardData["attibute"] = row.replace("Attribute", "").trim();
                        }
                        break;


                    case "Types":
                        cardData["types"] = (row.replace("Types", "").trim()).split("/");
                        break;

                    case "Rank":
                    case "Level":
                        if (cardData["level"] == undefined && !row.includes("Materials")) {


                            cardData["level"] = parseInt(row.replace(/\D/g, ""));
                        }
                        break;

                    case "ATK":
                        if (cardData["stats"] == undefined) {
                            cardData["stats"] = ((row.replace("ATK", "").trim()).split("/").map(val => {
                                val = val.replace(/\D/g, "");
                                return parseInt(val)
                            })).filter(val => !isNaN(val));
                        }
                        break;


                    case "Link Arrows":
                        cardData["link_arrows"] = row.replace("Link Arrows", "").trim();
                        break;

                }




            }




        }



        return cardData

    } catch (error) {

        console.log(error);

        return {}
        // console.log(cardName);
        // if(error.response.status != 404){


        //     console.log(error);

        // }




    }




}




const getCards = async(pack) => {
    const BASE = "https://www.konami.com/yugioh/duel_links/en/box/";
    let resp = (await axios.get(BASE + pack.href)).data;
    resp = search(resp, '<section id="card-list"');
    resp = search(resp[0], undefined, '</section>');



    const dom = stringTOhtml(resp).window.document;
    let content = dom.querySelectorAll("li");

    // const cards = [];

    // content.length


    // for (let i =0; i <content.length; i++) {
    //     const card = content[i];
    //     const card_data = {};
    //     card_data["name"] = card.querySelector("dt").textContent.replaceAll('"""', '"');
    //     card_data["name"] =   (card_data["name"].replaceAll(" The ", " the ")).replaceAll(" Of ", " of ")
    //     card_data["rarity"] = Array.from(card.querySelector("a").classList).filter(cl => cl.includes("rare"))[0].replace("rare-", "").toUpperCase();
    //     // card_data["description"] = await get_card_description(card_data["name"])
    //     const moredata = await get_card_description(card_data["name"] );
    //     card_data["fn"] = (card_data["name"].replaceAll('"', "")).replace(" ", "_");
    //     cards.push({...card_data, ...moredata})
    // }

    // for (let i = 0; i < cards.length; i++) {
    //     const ci = cards[i] ;
    //     try {
    //         downloadImage(ci.img, Cards + ci.fn + ".png")
    //     } catch (error) {
    //         console.log(error);

    //     }

    // }

    // fs.writeFileSync(MainFolderImgs + "manifiest.json", JSON.stringify(cards))

    const card_manifiest_name = "manifiest.cards.json";
    const pack_manifiest_name = "manifiest.packs.json";




    const max = content.length - 1;
    let i =  0;

    let card_manifiest
    try {
        card_manifiest = JSON.parse(fs.readFileSync(MainFolder + card_manifiest_name).toString());
    } catch (error) {
        card_manifiest = [];
    }

    let pack_manifiest
    try {
        pack_manifiest = JSON.parse(fs.readFileSync(MainFolder + pack_manifiest_name).toString());
    } catch (error) {
        pack_manifiest = [];
    }



    const getCard = async(i = 0) => {

const time = .5;


        const card = content[i];
        const card_data = {};


        card_data["pack"] = [pack.alt]

        card_data["name"] = card.querySelector("dt").textContent.replaceAll('"""', '"');
        console.log(i + "-WORKING IN " + card_data["name"]);
        card_data["name"] = (card_data["name"].replaceAll(" The ", " the ")).replaceAll(" Of ", " of ")
        card_data["rarity"] = Array.from(card.querySelector("a").classList).filter(cl => cl.includes("rare"))[0].replace("rare-", "").toUpperCase();
        // card_data["description"] = await get_card_description(card_data["name"])


        let cards_img = 0;
        if (card_manifiest.findIndex(c => c.name == card_data["name"]) == -1) {

            card_data["id"] = (card_manifiest[card_manifiest.length - 1]) ? (card_manifiest[card_manifiest.length - 1].id + 1) : (0);
            const moredata = await get_card_description(card_data["name"]);
            card_data["fn"] = (card_data["name"].replaceAll('"', "")).replace(" ", "_");
            cards_img = await GET_CARD_IMG(card_data["name"], Cards);
         
            
            cards_img = cards_img.filter(cd => cd != '');
          
            delete moredata.img
            card_data["img"] = cards_img;
        
            
            card_manifiest.push({...card_data, ...moredata })
      
        
            // card_data["img"] = "";

            // let j = 0;
            // let interval_int = setInterval(() => {

            //     try {
            //         downloadImage(cards_img[j], Cards + card_data.fn + "_" + j + ".png").then(re => console.log(re)
            //         )
            //         j++
            //         if (j == cards_img.length - 1) {
            //             clearInterval(interval_int)
            //         }

            //     } catch (error) {
            //         console.log(error);

            //     }
            // }, time *1000);;

        } else {
            const index = card_manifiest.findIndex(c => c.name == card_data["name"]) ;
            card_manifiest[index].pack.push( pack.alt);
            // console.log(i + "-END IN " + card_data["name"]);
        }

        if (content[i + 1] != undefined) {
            setTimeout(() => {
                console.log(i + "-END IN " + card_data["name"]);
                getCard(i + 1)
            // }, (cards_img.length + 2) * time * 1000);
        }, 500);
        } else {
            fs.writeFileSync(MainFolder + card_manifiest_name, JSON.stringify(card_manifiest))
            console.log("DONE");
            exit()
        }

    }




    const getManifiestTxt = () => {
        let txt = "";
        for (let i = 0; i < content.length; i++) {
            txt += `${i}-` + content[i].querySelector("dt").textContent.replaceAll('"""', '"') + "\n"
        }
        fs.writeFileSync(MainFolder + "cards.txt", txt)
        console.log("END");
        exit()
    }


    const dowload_Pack_IMG = async() => {
        const pack_imgs = await GET_CARD_IMG(pack.alt + " BOX BANNER HD");
        let j = 0;
        if (pack_manifiest.findIndex(p => p.name == pack.alt) == -1) {
            pack_manifiest.push({
                name: pack.alt,
                ["id"]: (pack_manifiest[pack_manifiest.length - 1]) ? (pack_manifiest[pack_manifiest.length - 1].id + 1) : (0),
                img: pack_imgs.filter(cd => cd != ''),
            })

            fs.writeFileSync(MainFolder + pack_manifiest_name, JSON.stringify(pack_manifiest))
            console.log("DONE");
            exit()
            // let interval_int = setInterval(() => {
            //     try {

            //         downloadImage(pack_imgs[j], Cards + pack.alt + "_BOX_" + j + ".png")
            //         j++

            //         if (j == pack_imgs.length - 1) {
            //             clearInterval(interval_int)
            //             pack_manifiest.push({
            //                 name: pack.alt,
            //                 ["id"]: (pack_manifiest[pack_manifiest.length - 1]) ? (pack_manifiest[pack_manifiest.length - 1].id + 1) : (0),
            //                 img: "",
            //             })
            //             fs.writeFileSync(MainFolder + pack_manifiest_name, JSON.stringify(pack_manifiest))
            //             console.log("DONE");
            //             exit()
            //         }

            //     } catch (error) {
            //         console.log(error);

            //     }
            // }, 1500);;
        }
        console.log("DONE");
        exit()

    }



    // const args = process.argv.slice(2);

    // // args[0] será el primer parámetro después de 'node index.js'
    // const param = args[0];

    console.log("Loading mode: -" + action);

    switch (action) {
        case "card":
            getCard(i);
            break;

        case "man":
            getManifiestTxt()
            break;
        case "pack":
            dowload_Pack_IMG()
            break;

        default:
            break;
    }




}







// const action  = "card";

// const action  = "card";

// const action  = "man";

// getCards(manifiest[Object.keys(manifiest)[0]][0]);

const [pack,action,indexPack] = argv.slice(2);

getCards(manifiest[Object.keys(manifiest)[pack]][indexPack] );


