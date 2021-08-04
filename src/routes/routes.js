var express = require('express');
var router = express.Router();
const { JTF2SignNames, ATF2SignNames, ATFLine2SignNames } = require("../Converters/JTF2SignNames.js");

//JTF-to-Signnames 
router.post('/getSignnamesJTF',(req,res)=>{
	const jtf = req.body.jtf;
	const output = JTF2SignNames(jtf);
	res.send(output);
});

//ATF-to-Signnames
router.post('/getSignnamesATF',(req,res)=>{
	const atf = req.body;
	const output = ATF2SignNames(atf);
	res.send(output);
});

//ATFLine-to-Signnames

const temp ="muk";
router.post('/getSignnamesATFLINE',(req,res)=>{
	const atf = req.body.atf;
	const output = ATFLine2SignNames(temp);
	res.send(output);
});


module.exports = router;
