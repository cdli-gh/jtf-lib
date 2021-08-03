var express = require('express');
var router = express.Router();
const { JTF2SignNames, ATF2SignNames } = require("../Converters/JTF2SignNames.js");
const { updateInsciption } = require('../API/DBCRUD.js')
//JTF-to-Signnames 
router.post('/getSignnamesJTF',(req,res)=>{
	const jtf = req.body.jtf;
	const output = JTF2SignNames(jtf);
	res.send(output);
});

//ATF-to-Signnames
router.post('/getSignnamesATF',(req,res)=>{
	const atf = req.body.atf;
	const output = ATF2SignNames(atf);
	res.send(output);
});

//update Inscription from uqnu
router.post('/updateInsciption/:id', updateInsciption);

module.exports = router;
