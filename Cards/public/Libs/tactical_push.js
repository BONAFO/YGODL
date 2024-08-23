/**
 * Agrega un valor en una posición específica en el arreglo.
 * 
 * @param {*} value - El valor a agregar en el arreglo.
 * @param {number} index - La posición en la que se debe agregar el valor.
 * @returns {Array} El arreglo modificado.
 */

Array.prototype.tp =  function(value , index) {
    index = parseInt(index);
 if(!isNaN(index)){
    const splited = [this.slice(0 ,index) , this.slice(index ) ];
    splited[0].push(value)

    
    this.length = 0; 
    this.push(...splited[0], ...splited[1]);

    
 }else{
    throw new Error("Index must be a Number");
    
 }
};