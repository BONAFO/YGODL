const base = './DB/Final/manifiest.cards.json';
const { log } = require("console");
const { readFileSync, writeFileSync } = require("fs");

const data = JSON.parse(readFileSync(base).toString());

const EvalMonster =(data)=>{

Object.keys(data).map((k)=>{
    if(data[k] === undefined || data[k] === null  ){
        delete data[k]
        
        
    }
    

    if(typeof data[k] == 'string' && data[k].length == 0){
        delete data[k]
        
    }

    if(Array.isArray(data[k])){
        data[k] =  data[k].filter(d =>  d != null);
        if(data[k].length == 0){
            delete data[k]
        }
    }



})

if(!Array.isArray(data["types"])){
    data["types"] = [data["types"]];
}
return data
}


const EvalTrapSpell = (data)=>{
    Object.keys(data).map((k)=>{
        if(Array.isArray(data[k])){
            data[k] =  data[k].filter(d =>  d != null);
            if(data[k].length == 0){
                delete data[k]
            }
        }

        if(data[k] === undefined || data[k] === null  ){
            delete data[k]
        }

    })


    delete data["stats"]

    if(!Array.isArray(data["types"])){
        data["types"] = [data["types"]];
    }


    return data

}
data.map((c, i) => {
    switch (c.type) {
        case 'Spell':
            data[i] =  EvalTrapSpell(c)
            break;
        case 'Monster':
          data[i] =  EvalMonster(c)
            break;
        case 'Trap':
            data[i] =  EvalTrapSpell(c)
            
            
            break;
        default:
            break;
    }


    

})
writeFileSync(base , JSON.stringify(data))
