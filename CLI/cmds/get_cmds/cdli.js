#!/usr/bin/env node
const fs = require('fs');
const decode = require('html-entities').decode;
const axios = require("axios");
const { ATF2JTF } = require('../../../Converters/ATF2JTF.js');

const regexData = /(?:class="revcontent">)(?<version>[\s\S]+?)<br>(?<atf>[\s\S]+?)(?:<\/div>)/g
const regexVersion = /(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}:\d{2}), entered by (?<by>.+?) for (?<for>.+?) $/

exports.command = 'cdli <PNumbers..>'
//exports.command = '<name> <url>'
exports.desc = 'Get CDLI data for <PNumbers..> and save as JTF collection'
exports.builder = {}

exports.handler = function (argv) {
  //
  let collection = argv.PNumbers.map( PNumber => getCDLIbyPNumber( PNumber ));
  Promise.all(collection).then( data2save => {
	  fs.writeFile('test.jtfc', JSON.stringify(data2save), saveCallback)
  }).catch( (e) => {
	  console.log('An error occured while fetching CDLI data:', e)
  });
};

const saveCallback = (err, data) => { 
  //
  return console.log(data);
  if (err) {
    return console.log(err);
  }
};

const getCDLIbyPNumber = ( PNumber ) => {
  //
  let ID = PNumber.slice(1,7);
  const url = `https://cdli.ucla.edu/search/revhistory.php/?txtpnumber=${ID}`;
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
    JTF = ATF2JTF( resultArr[0].atf );
    return JTF;
   });
};

