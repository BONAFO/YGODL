const { JSDOM } = require('jsdom');
const { getProdoData, search } = require('./html');
const {  writeFileSync } = require('fs');
const { default: axios } = require('axios');
const { exit } = require('process');

const baseUrl = 'https://www.konami.com/yugioh/duel_links/en/box/';
let raw_dup;
let br = 0;
const sections = [];

axios.get(baseUrl).then(re => {
    const dom = (new JSDOM(re.data)).window.document;
    const divs = dom.getElementsByClassName('box-page')[1];
    raw_dup = divs.outerHTML;
    StartDecript()
})





const StartDecript = () => {
    do {
        br++
        const searched = search(raw_dup, "<section", "</section>");


        if (searched[1] == -1 || searched[2] == -1) {
            break
        }
        sections.push(searched[0])
        raw_dup = raw_dup.slice(raw_dup.indexOf("</section>") + "</section>".length);

        // sections.push(search(raw_dup, "<section", "</section>"))
        // raw_dup = search(raw_dup, "</section>", undefined);
    } while (br < 10000);

    const manifiest = {};

    for (let i = 0; i < sections.length; i++) {

        // console.log("-------------------------------------------------");
        // console.log(sections[i]);
        // console.log("-------------------------------------------------");

        let dom = new JSDOM(sections[i]);
        dom = dom.window.document;
        const ul = dom.querySelector("ul");
        const li = dom.querySelectorAll("li");
        const setData = [];
        for (let i = 0; i < li.length; i++) {



            const a = li[i].querySelector("a");
            const img = li[i].querySelector("img");
            let proto_A
            let proto_IMG
            const protoData = {}
            if (a) {
                proto_A = getProdoData(a);
                protoData.href = proto_A.href
            }

            if (img) {
                proto_IMG = getProdoData(img);
                protoData.src = proto_IMG.src
                protoData.alt = proto_IMG.alt
            }





            if (protoData.href && protoData.src && protoData.alt) {
                setData.push(protoData)
            }


        }


        switch (i) {
            case 0:
                manifiest["main_box"] = setData;
                break;

            case 1:
                manifiest["mini_box"] = setData;
                break;


            case 2:
                manifiest["structure_deck"] = setData;
                break;
        }



    }


    writeFileSync('./Cards/manifiest.temp.json', JSON.stringify(manifiest))
    exit()
    // return manifiest
}
