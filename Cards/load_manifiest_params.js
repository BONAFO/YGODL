const manifiest = require("./manifiest.temp.json");
console.clear()
console.log("Manifiest Params:");
console.log("-------------------------------------");
console.log(`Keys: `);
Object.keys(manifiest).map((k,i) => {
  console.log(`${i}) ${k}`);
})
console.log(`####################################`);
console.log(`Limits: `);
Object.keys(manifiest).map((k,i) => {
  console.log(`${i}) ${manifiest[k].length}`);
})

console.log("-------------------------------------");
