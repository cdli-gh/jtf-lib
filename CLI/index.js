#!/usr/bin/env node
/*const decode = require('html-entities').decode;
const yargs = require("yargs");
const axios = require("axios");
const { ATF2JTF } = require('../Converters/ATF2JTF.js');

const options = yargs
 //.usage("Usage: -n <name>")
 .command('get CDLI PNumbers..', 'Fetch from CDLI using a list of CDLI IDs (P-Numbers)').help( )
 .command('get aft <source_path> <target_path>', 'download several files').help( )
 //.option("n", { alias: "number", describe: "CDLI ID (P-Number)", type: "string", demandOption: true })
 .argv;

const regexData = /(?:class="revcontent">)(?<version>[\s\S]+?)<br>(?<atf>[\s\S]+?)(?:<\/div>)/g
const regexVersion = /(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}:\d{2}), entered by (?<by>.+?) for (?<for>.+?) $/

const getCDLIbyPNumber = ( PNumber ) => {
  //
  let ID = PNumber.slice(1,7);
  const url = `https://cdli.ucla.edu/search/revhistory.php/?txtpnumber=${ID}`;
  axios.get(url, { headers: { Accept: "application/json" } })
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
        ...version,
        atf: atf,
      });
    };
    return ATF2JTF( resultArr[0].atf );
   });
};

console.log( options )
*/
//options.PNumbers.forEach( PNumber => getCDLIbyPNumber( PNumber ) );

