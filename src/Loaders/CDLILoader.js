'use strict';

/*---/ imports /------------------------------------------------------------*/
//const fs = require('fs');
//var he = require('he'); //html entities
const ATF2JTF = require('../Converters/ATF2JTF.js').ATF2JTF;
//const getHTML = require('./getHTMLData.js').getHTML;
//const importMetaCDLI = require('./CDLIMetaLoader.js').importMeta;
const fetch = require('node-fetch');
const decode = require('html-entities').decode;

/*---/ globals /------------------------------------------------------------*/
const ATF_URL = 'https://cdli.ucla.edu/search/revhistory.php/?txtpnumber=';

/*---/ methods /------------------------------------------------------------*/

// Clean-up:
// * Remove `node-html-parser` if not used elsewere.

const regexData = /(?:class="revcontent">)(?<version>[\s\S]+?)<br>(?<atf>[\s\S]+?)(?:<\/div>)/g;
const regexVersion = /(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}:\d{2}), entered by (?<by>.+?) for (?<for>.+?) $/;

const getCDLIATFbyPNumber = ( PNumber ) => {
  //
  let ID = PNumber.replace(/[p|P]/g,'');
  const url = `https://cdli.ucla.edu/search/revhistory.php?txtpnumber=${ID}`;
  return fetch(url, { headers: { Accept: "application/json" } })
    .then(res => res.text)
    .then(res => {
    let resultArr = [];
    for (const m of res.matchAll(regexData)) {
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
  let ID = PNumber.replace(/[p|P]/g,'');
  return ATF2JTF( getCDLIATFbyPNumber(PNumber), `P${ID}` );
};

module.exports.getCDLIATFbyPNumber = getCDLIATFbyPNumber;
module.exports.getCDLIJTFbyPNumber = getCDLIJTFbyPNumber;
