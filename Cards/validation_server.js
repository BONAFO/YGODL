// server.js
const express = require('express');
const path = require('path');
const { mkdirSync, readFileSync, writeFileSync } = require ("fs");
const app = express();
const port = 3000;
const cardsManifiest = require('../DB/manifiest.cards.json');
let cardsManifiestFinal
const final_db = './DB/Final/manifiest.cards.json';
// try {
//     cardsManifiestFinal = require('../DB/Final/manifiest.cards.json');
// } catch (error) {        
//     writeFileSync(final_db, JSON.stringify([]))
//     cardsManifiestFinal =[]
// }

const get_final_manifiest =()=>{
    return JSON.parse(readFileSync(final_db).toString())
}

try {
    mkdirSync('./DB/Final')
} catch (error) {
    
}




// Middleware para parsear JSON
app.use(express.json());
// Middleware para parsear datos URL-encoded
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/cards',(req,res)=>{
    res.sendFile( path.join(__dirname, 'public', 'cards.html'))
})

app.get('/cards/data',(req,res)=>{
let i = 0;
const cardsManifiestFinal = get_final_manifiest();
do {
    if(cardsManifiestFinal.findIndex(c => c.id == cardsManifiest[i].id) == -1 && cardsManifiest[i] != undefined){
        cardsManifiest[i]["index"] = i;
        res.json(cardsManifiest[i])  
        break
    }
 
    
    if(i > cardsManifiest.length){
        res.status(404).json({})  
        break
    }
    i ++
} while (true);



})

app.post('/cards/',(req,res)=>{
    const cardsManifiestFinal = get_final_manifiest();
    try {
        delete req.body.index
        cardsManifiestFinal.push(req.body)  
        writeFileSync(final_db, JSON.stringify(cardsManifiestFinal))
        res.status(200).json({msj: 'SAVED!'})
    } catch (error) {
        res.status(500).json({err: error})
    }

    
})

app.get('/packs',(req,res)=>{
    res.sendFile( path.join(__dirname, 'public', 'index.html'))
})





app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
