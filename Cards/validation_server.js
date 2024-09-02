// server.js
const express = require('express');
const path = require('path');
const { mkdirSync, readFileSync, writeFileSync, link } = require("fs");
const app = express();
const port = 3000;
const cardsManifiest = require('../DB/manifiest.cards.json');
const { default: axios } = require('axios');
let cardsManifiestFinal
const final_db = './DB/Final/manifiest.cards.json';
const { JSDOM } = require('jsdom');
const { log } = require('console');
// try {
//     cardsManifiestFinal = require('../DB/Final/manifiest.cards.json');
// } catch (error) {        
//     writeFileSync(final_db, JSON.stringify([]))
//     cardsManifiestFinal =[]
// }

const get_final_manifiest = () => {
    return JSON.parse(readFileSync(final_db).toString())
}

try {
    mkdirSync('./DB/Final')
} catch (error) {

}


const getImg = async (card) => {
    card = card.replaceAll(" ", "+")
    card = card.replaceAll("-", "+")
    const link_base = `https://www.google.com/search?q=${card}+yu+gi+oh+pro&oq=${card}+yu+gi+oh+pro`;
    const google_respo = (await axios.get(link_base)).data
    const dom = new JSDOM(google_respo).window.document;
    for (let i = 0; i < dom.querySelectorAll("a").length; i++) {
        const anchor = dom.querySelectorAll("a")[i];
        if (anchor.textContent.toLowerCase().replaceAll(" ", "").includes("ygopro")) {





            try {
                let url = anchor.href.replace("/url?q=", "");
                const ygo_response = (await axios.get(url)).data;
                const index = [ygo_response.indexOf('figure'), ygo_response.indexOf('figcaption')];
                let tx = ygo_response.slice(index[0], index[1]);
                const dom = new JSDOM(tx).window.document;
                return dom.querySelectorAll("img")[0].src


            } catch (error) {
                console.log(error);
                console.log(error.status);

                return error.status
            }

        }


    }


}



// Middleware para parsear JSON
app.use(express.json());
// Middleware para parsear datos URL-encoded
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/cards', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cards.html'))
})


let saved = false;

app.get('/cards/data', async (req, res) => {
    let i = 0;
    const cardsManifiestFinal = JSON.parse(JSON.stringify(get_final_manifiest()));


    do {
        if (cardsManifiestFinal.findIndex(c => c.id == cardsManifiest[i].id) == -1 && cardsManifiest[i] != undefined) {
            cardsManifiest[i]["index"] = i;
            const img = await getImg(cardsManifiest[i].name)
            cardsManifiest[i].err = undefined;
            if (img && img != 404 && !saved) {
                saved = true
                cardsManifiest[i].img = [img].concat(cardsManifiest[i].img);
            } else if (img != 404 && !saved) {
                cardsManifiest[i].err = 404;
            }
            cardsManifiest[i].max = cardsManifiest.length;
            res.json(cardsManifiest[i])
            break
        }


        if (i > cardsManifiest.length) {
            res.status(404).json({})
            break
        }
        i++
    } while (true);



})

app.post('/cards/', (req, res) => {
    const cardsManifiestFinal = get_final_manifiest();
    try {
        delete req.body.index
        cardsManifiestFinal.push(req.body)
        writeFileSync(final_db, JSON.stringify(cardsManifiestFinal))
        res.status(200).json({ msj: 'SAVED!' })
    } catch (error) {
        res.status(500).json({ err: error })
    }


})

app.get('/packs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})





app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


