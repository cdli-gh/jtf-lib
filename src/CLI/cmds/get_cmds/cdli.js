#!/usr/bin/env node
const fs = require('fs');
const decode = require('html-entities').decode;
const axios = require("axios");
const { ATF2JTF } = require('../../../Converters/ATF2JTF.js');

const regexData = /(?:class="revcontent">)(?<version>[\s\S]+?)<br>(?<atf>[\s\S]+?)(?:<\/div>)/g
const regexVersion = /(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}:\d{2}), entered by (?<by>.+?) for (?<for>.+?) $/

const { postprocess } = require('../get.js');

exports.command = 'cdli [pipe] [abstract] <path|pNumbers..>';
exports.desc = 'Get data from CDLI.';
exports.builder = {
  path: {
    type: 'string',
    desc: 'path to a text file with a list of p-numbers',
  },
  pNumbers: {
    type: 'string',
    desc: 'P-numbers (e.g.: P000001 P000002)',
  },
  pipe: {
    alias: ['p'],
    type: 'boolean',
    default: false,
    desc: 'Pipe output to localhost:9000 response',
  },
  abstract: {
    alias: ['a'],
    type: 'boolean',
    default: false,
    desc: 'Output "abstract" sign representation',
  },
};

exports.handler = function( argv ){
  //
  let pNumbersArr = (argv.path.length===1) 
    ? pNumbersFromFile( argv.path[0] )
    : null;
  let collection = ( pNumbersArr ) 
    ? getCollection( pNumbersArr )
    : getCollection( argv.pNumbers );
  collection = [...new Set(collection)];
  console.log(`\nFound ${collection.length} p-number(s)\n`);
  postprocess(collection, argv);
};

const pNumbersFromFile = ( path ) => {
    // Extract PNumbers from text file.
    try {
        fs.accessSync(path, fs.constants.F_OK);
        let pNumbers = Array.from(
          fs.readFileSync(path, 'utf8').matchAll(/[p|P]\d{6}/g),
          m => m[0]);
        return pNumbers;
    } catch (e){
        //console.error(`File ${path} does not exist`);
    };
};

const getCollection = ( pNumbers ) => {
    //
    return pNumbers.map( PNumber => getCDLIbyPNumber( PNumber ));
};

const getCDLIbyPNumber = ( PNumber ) => {
  //
  let ID = PNumber.slice(1,7);
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
    return ATF2JTF( resultArr[0].atf, PNumber );
   });
};
