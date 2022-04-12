'use strict';

/*---/ imports /------------------------------------------------------------*/
//const fs = require('fs');
//var he = require('he'); //html entities
const ATF2JTF = require('../Converters/ATF2JTF.js').ATF2JTF;
//const getHTML = require('./getHTMLData.js').getHTML;
//const importMetaCDLI = require('./CDLIMetaLoader.js').importMeta;
const axios = require("axios");
const decode = require('html-entities').decode;

/*---/ globals /------------------------------------------------------------*/
const ATF_URL = 'https://cdli.ucla.edu/search/revhistory.php/?txtpnumber=';

/*---/ methods /------------------------------------------------------------*/

// Clean-up:
// * Remove `node-html-parser` if not used elsewere.

/* const importCDLI = async function ( P_Number ) {
	// Import ATF strings from CDLI by P-number.
	P_Number = P_Number.replace(/[P|p]/, '')
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
}; */

const regexData = /(?:class="revcontent">)(?<version>[\s\S]+?)<br>(?<atf>[\s\S]+?)(?:<\/div>)/g
const regexVersion = /(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}:\d{2}), entered by (?<by>.+?) for (?<for>.+?) $/

const getCDLIATFbyPNumber = ( PNumber ) => {
  //
  let ID = PNumber.replace(/[p|P]/g,'');
  const url = `https://cdli.ucla.edu/search/revhistory.php?txtpnumber=${ID}`;
  return axios.get(url, { headers: { Accept: "application/json" } })
    .then(res => {
    let { data } = res;
    let resultArr = [];
    for (const m of res.data.matchAll(regexData)) {
      let version = m.groups.version.match(regexVersion).groups;
      let atf = decode(
      m.groups.atf
      .replace(/<br \/>/g, ' ')
      .replace(/<[\/| ]*del>/g, '')
      )+'\n';
      resultArr.push({
        source: 'CDLI',
        version: version,
        atf: atf,
      });
    };
    return resultArr[0].atf;
   });
};

const getCDLIJTFbyPNumber = ( PNumber ) => {
  //
  let ID = PNumber.replace(/[p|P]/g,'');
  return ATF2JTF( getCDLIATFbyPNumber(PNumber), `P${ID}` );
};

/* const getRevisions = function ( htmlObj ) {
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
}; */

module.exports.getCDLIATFbyPNumber = getCDLIATFbyPNumber;
module.exports.getCDLIJTFbyPNumber = getCDLIJTFbyPNumber;
