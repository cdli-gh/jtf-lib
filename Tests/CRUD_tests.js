// Tests for CRUD functions. 
// Run with `node CRUD_tests`.
//
const {Strip, Create, Read, Update, Delete} = require('../API/JTFCRUD.js');

classes = [
	'Object', 'Surface', 'Column', 'Ruling', 'State', 'Seal', 'Comment', 
	'Line', 'Sequence', 'Chr', 'Field'
	];

console.log(`Create 'Object' Element (no parameters given).`)
console.log(Create())

classes.forEach( className => {
		console.log(`\nCreate '${className}' Element.`)
		console.log(Create(className));
	}
);

//(JTFClass='Object', {container, index, params}={}){

let object = Create();
let surface = Create('Surface', {container: object})
let column = Create('Column', {container: surface})
let line = Create('Line', {container: column})

console.log(object)
console.log(surface)
console.log(column)
console.log(line)
