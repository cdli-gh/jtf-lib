/*---/ imports /------------------------------------------------------------*/
const express = require("express");
const app = express();
const cookieparser = require('cookie-parser');
var bodyParser = require('body-parser')
const cors = require('cors');
const port = process.env.PORT || 3003;
const routes = require('./routes/routes.js')
/* JTF Schema */
const { JTFSchema, JTFSchema2Str } = require('./Data/JTFSchema.js');

/* ATF to JTF */
const { ATF2JTF, ATFLine2JTF, ATFChar2JTF } = require('./Converters/ATF2JTF.js');
const { importCDLI } = require('./Loaders/CDLILoader.js');
const { importKeiBi } = require('./Loaders/KeiBiLoader.js');

/* JTF to ATF-O */
const { JTFChar2ATFO } = require('./Converters/JTF2ATF_O.js');

const { Create, Read, Update, Delete, Strip } = require('./API/JTFCRUD.js');


//MiddleWares
app. use(bodyParser. json({
	limit: '50mb'
	}));
app.use(cookieparser());
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
  }));

app.use('/api',routes);

app.get('/',(req,res) => {
	res.send("JTF-lib");
})
//Listening on 8081
app.listen(port, () => {
    console.log(`app is running on aa ${port}`);
});

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