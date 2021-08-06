#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ATF2JTF } = require('../../../Converters/ATF2JTF.js');
const { JTF2SignNames } = require('../../../Converters/JTF2SignNames.js');
const { postprocess } = require('../get.js');

exports.command = 'local [pipe] [abstract] <path>';
exports.desc = 'Get data from local ATF file.';
exports.builder = {
  path: {
    type: 'string',
    desc: 'Path to .atf or .txt file | directory with files',
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

exports.handler = async function( argv ){
    //
    let type = (!fs.existsSync(argv.path)) 
      ? null
      : (fs.lstatSync(argv.path).isDirectory()) 
      ? 'dir'
      : (fs.lstatSync(argv.path).isFile())
      ? 'file'
      : null;
    if (!type){
        console.log('* Invalid path. Correct and try again')
        return;
    };
    let collection = (type==='dir') 
      ? getFromDir( argv.path )
      : (type==='file')
      ? getFromFile( argv.path )
      : [];
    postprocess(collection, argv);
};

const getFromDir = (dirPath) => {
    //
    let files = fs.readdirSync(dirPath).filter( fName => fName.match(/.*\.(atf|txt)/ig ));
    if (files.length>0){
        let collection = [];
        console.log(`\n* Found ${files.length} matching files (.atf or .txt). Processing`);
        files.forEach( fName => {
          let jtfc = getATFFromFile(path.join(dirPath, fName));
          collection = [...collection, ...jtfc];
        });
        return collection;
    } else {
        console.log(`\n* Not matching files (.atf or .txt) found.`);
        return [];
    };
};

const getFromFile = (filePath) => {
    //
    let string = fs.readFileSync(filePath, 'utf8');
    collection = string.split(/(?:\r)\n\s*(?:\r)\n/).filter( str => str.trim()!=='');
    let total = collection.length;
    let percent = total / 100;
    let log = false;
    if (total>1){
      console.log(`Processing ${collection.length} atf texts at file ${filePath}`);
      log = true;
    };
    return collection.map( (atf, i) => {
        let PNumber = atf.slice(1,8);
        let jtf = Promise.resolve(ATF2JTF( atf, PNumber ));
        if (log){ logProgress(i, total, percent) }
        return jtf;
    });
};

const logProgress = (i, total, percent, step=100) => {
    //
    if (i % step===0 || i===1 ){
        let progress = (i / percent).toFixed(2);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Progress: ${progress}%`)
    } else if ( i===total-1 ){
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    }
}