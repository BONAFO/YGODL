const { log } = require("console");
const { readdir, readdirSync, copyFile, copyFileSync, existsSync } = require("fs");

const exceptions =
[
    "Bite_Bug_0",
"Bitrooper_0"
]
;
let data = readdirSync('./Images/Cards/')

const base = [];

data.map(c => {
    const name = c.substring(0, c.lastIndexOf("_"));
    if (base.indexOf(name) == -1 && !name == '') {
        base.push(name)
    }



})



let updated = 0;

const UPDATE_DB =()=>{
    for (let i = 0; i < base.length; i++) {

        const max = 15;
        let tri = 0;
        do {
    
            if(!existsSync(`./Filtrated/${base[i]}_${tri}.png`) && exceptions.indexOf(`${base[i]}_${tri}`) == -1){
                try {
                    console.log(`Trying ${base[i]}_${tri}.png`);
                    copyFileSync(`./Images/Cards/${base[i]}_${tri}.png` , `./Filtrated/${base[i]}_${tri}.png`)
                    updated++
                    console.log(`Copied! ${base[i]}_${tri}.png`);
                    break
                } catch (error) {
                    if (tri == max) {
                        break
                    }
                    tri++
                }
        
            }else{
                break
            }
    
        } while (true);
    
    }
}


updated = 0;
UPDATE_DB()
console.clear()
console.log(`Updated ${updated}.`);

