'use strict';

/*---/ imports /------------------------------------------------------------*/
//const fs = require('fs');
var he = require('he'); //html entities
const ATF2JTF = require('../Converters/ATF2JTF.js').ATF2JTF;
const getHTML = require('./getHTMLData.js').getHTML;
const importMetaCDLI = require('./CDLIMetaLoader.js').importMeta;

/*---/ globals /------------------------------------------------------------*/
const ATF_URL = 'https://cdli.ucla.edu/search/revhistory.php/?txtpnumber=';

/*---/ methods /------------------------------------------------------------*/

const importCDLI = async function ( P_Number ) {
	// Import ATF strings from CDLI by P-number.
	P_Number = P_Number.replace('P', '')
	var url = encodeURI(ATF_URL+P_Number+'&');
	console.log(url);
	return await getHTML( url )
		.then((htmlObj) => {
			var revisions = getRevisions( htmlObj );
			var jtf = ATF2JTF( revisions[0].atf );
			return importMetaCDLI( P_Number )
				.then( metaCDLI => {
					jtf._metaCDLI = metaCDLI;
					return jtf;
				});
		})
		.catch(console.error)
};

const getRevisions = function ( htmlObj ) {
	//
	var revisions = [];
	htmlObj.querySelectorAll('.revcontent').forEach(
		revcontent => {
			revisions.push(revcontent2obj(revcontent))}
	);
	return revisions;
};

const revcontent2obj = function( revcontent ){
	//
	var lines = he.decode(revcontent.rawText)
		.replace(' &P', '\n&P')
		.split('\n');
	var [v_date_time, v_author] = lines[0].split(', ');
	var [v_date, v_time] = v_date_time.split(' ');
	var [v_by, v_for] = v_author
		.replace(/entered by[ ]+/, '')
		.split(/[ ]+for[ ]+/);
	var str = lines.slice(1,).join('\n')+'\n';
	var revision = {
		date: v_date,
		time: v_time,
		by: v_by,
		for: v_for,
		atf: str};
	return revision;
};

module.exports.importCDLI = importCDLI;