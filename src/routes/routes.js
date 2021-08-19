var express = require('express');
var router = express.Router();
const { getCDLIJTFbyPNumber, getCDLIATFbyPNumber } = require("../Loaders/CDLILoader.js");
const { JTF2SignNames, ATF2SignNames, ATFLine2SignNames } = require("../Converters/JTF2SignNames.js");

//Fetch ATF from CDLI (legacy website) and convert to JTF
router.post('/getCDLIJTF',(req,res)=>{
	const pNumbers = req.body.pNumbers;
	const output = pNumbers.map(p => getCDLIJTFbyPNumber(p));
	Promise.all(output).then( out => {
		res.send(out)} )
});

//Fetch ATF from CDLI (legacy website) and serve as one ATF file
router.post('/getCDLIATF',(req,res)=>{
	const pNumbers = req.body.pNumbers;
	const output = pNumbers.map(p => getCDLIATFbyPNumber(p));
	Promise.all(output).then( out => {
		res.send(out.join('\n\n'))} )
});

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

//ATFLine-to-Signnames
router.post('/getSignnamesATFLINE',(req,res)=>{
	const atf_line = req.body.atf;
	const output = ATFLine2SignNames(atf_line);
	res.send(output);
});


module.exports = router;
