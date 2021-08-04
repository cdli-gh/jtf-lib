/*---/ imports /------------------------------------------------------------*/

/* JTF Schema */
const { JTFSchema, JTFSchema2Str } = require('./Data/JTFSchema.js');

/* ATF to JTF */
const { ATF2JTF, ATFLine2JTF, ATFChar2JTF } = require('./Converters/ATF2JTF.js');
const { importCDLI } = require('./Loaders/CDLILoader.js');
const { importKeiBi } = require('./Loaders/KeiBiLoader.js');

/* JTF to ATF-O */
const { JTFChar2ATFO } = require('./Converters/JTF2ATF_O.js');

 const { app }   = require('./endpoint.js');

const { Create, Read, Update, Delete, Strip } = require('./API/JTFCRUD.js');

/* JTF to ATF */
// ToDo. 

/*---/ exports /------------------------------------------------------------*/

module.exports = {
	JTFSchema,
	
	importCDLI,
	importKeiBi,
	
	ATF2JTF,
	ATFLine2JTF,
	ATFChar2JTF,
	
	JTFChar2ATFO,
	
	Create,
	Read,
	Update,
	Delete,
	Strip,
};