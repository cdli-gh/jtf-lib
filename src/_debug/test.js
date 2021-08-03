'use strict';

/*---/ imports /------------------------------------------------------------*/
const fs = require('fs');
const ATF2JTF = require("./index.js").ATF2JTF;
const importCDLI = require("./index.js").importCDLI;
const importKeiBi = require("./index.js").importKeiBi;
var pt = require('promise-timeout');

console.log('Testing ATF parser');

var atfSourceDir = '../data/atf';
var ATFByPeriodPath = '../data/ATFByPeriodClean.json';

const atfArr = fs.readdirSync(atfSourceDir);
const ATFByPeriod = JSON.parse(
	fs.readFileSync(ATFByPeriodPath)
);

function reportATFbyPeriod(){
	console.log(
		'ATF source directory loaded successfully.',
		'\n\tPath: ', atfSourceDir, 
		'\n\tTotal: ', atfArr.length, 'files',
		);
	console.log(
		'ATFByPeriod JSON loaded successfully.',
		'\n\tPath: ', ATFByPeriodPath, 
		'\n\tPeriodDicts: ', ATFByPeriod.length
		);
};

/*---/ Evaluate CDLI ATF collection /---------------------------------------*/

var evaluation = {success: [], fail: [], timeout: []}

const eval_item = function( item ){
	//
	var path = atfSourceDir+'/'+item+'.atf';
	var atfStr = fs.readFileSync(path, 'utf8')
		.replace(/[ ]*(\r\n|\n|\r)/gm, '\n');
	try {
		var res = ATF2JTF(atfStr);
		console.log( item, 'success' );
		evaluation.success.push(item)
	} catch (e) {
		console.log( item, 'fail' );
		evaluation.fail.push(item)
		console.log([atfStr]);
	};
};

function myPromise(ms, callback) {
	//
	return new Promise(
		function(resolve, reject) {
			// Set up the real work
			callback(resolve, reject);
			// Set up the timeout
			setTimeout(function() {
				reject('Promise timed out after ' + ms + ' ms');
			}, ms);
	});
};

function log_eval(){
	//
	var jsonContent = JSON.stringify(evaluation);
	fs.writeFile("evaluation.json", jsonContent, 'utf8', function (err) {
		if (err) {
			console.log("An error occured while writing JSON Object to File.");
			return console.log(err);
		}
		console.log("JSON file has been saved.");
	});
};

// Important: promise doesn't work!
function eval_all(){
	//
	reportATFbyPeriod();
	ATFByPeriod.forEach(function(periodDict){
		console.log(periodDict.name, periodDict.p_numbers.length);
		periodDict.p_numbers.forEach(function(item){
		myPromise(10000, function(resolve, reject) {
			// Real work is here
			eval_item(item)
			});
		});
	});
	log_eval();
};

// Important: promise doesn't work!
function eval_fails( ){
	//
	var fails = JSON.parse(fs.readFileSync('fails_7.json', 'utf8'));
	fails.forEach( function(item){
/* 		myPromise(10000, function(resolve, reject) {
			// Real work is here */
			if (!['P006396'].includes(item)){
				eval_item(item)
			};
		//});
	});
};

// evaluate local atf by genre
//eval_all(  )

// evaluate single item by P-number
//eval_item( 'P006396' )

// evaluate failed aft (fails.json)
eval_fails( )

//importKeiBi(); 
// there are issues with KeiBi accessibility (some pages doesn't open)

/*
importCDLI('P285640')
	.then(
		jtf => {console.log(jtf)}
	);
*/

/*---/ Parse /--------------------------------------------------------------*/

//P.parseATFFile()

/*---/ Save output /--------------------------------------------------------*/


fs.writeFile(
	"output.json",
	JSON.stringify(evaluation),
	function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});