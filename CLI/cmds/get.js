#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const createHttpTerminator = require('http-terminator').createHttpTerminator;
const { JTF2SignNames } = require('../../Converters/JTF2SignNames.js');

exports.command = 'get <source>'
exports.desc = 'Import JTF data'
exports.builder = function (yargs) {
  return yargs.commandDir('get_cmds');
}
exports.handler = function (argv) {};

exports.postprocess = async (collection, argv={}) => {
    // Check for errors, save to file or pipe collection data.
    collection = await Promise.allSettled(collection);
    let [fulfilledArr, nonFulfilledArr] = sortResult(collection);
    if (fulfilledArr.length>0){
        console.log(`* Converted ${fulfilledArr.length}/${collection.length} atf item(s) to jtf`);
        errorReport(fulfilledArr, nonFulfilledArr);
        if ( argv.abstract ){
            abstractOutput( fulfilledArr, argv );
        } else {
            collectionOutput(fulfilledArr, argv);
        };
    };
};

const sortResult = (collection) => {
    //
    let fulfilledArr = []; 
    let nonFulfilledArr = [];
    if (collection.length===0){return [[], []]};
    if (collection[0].status){
      fulfilledArr = collection
        .filter(p => p.status==='fulfilled' && p.value.success===true)
        .map( p => p.value);
      nonFulfilledArr = collection
        .filter(p => p.status!=='fulfilled' || p.value.success!==true)
        .map( p => p.value);
    } else {
        fulfilledArr = collection.filter(jtf => jtf.success===true);
        nonFulfilledArr = collection.filter(jtf => jtf.success!==true);
    };
    return [fulfilledArr, nonFulfilledArr];
};

const collectionOutput = (fulfilledArr, argv) => {
    // Save to JTFC file or pipe to stdout.
    let out = JSON.stringify(fulfilledArr);
    if (argv.pipe){
        console.log('* Serving jtf collection');
        serve( out );
        //console.log(`* Writing collection to stdout.`);
        //process.stdout.write(out);
        //var buffer = Buffer.alloc(Buffer.byteLength(out));
        //buffer.write(out);
    } else {
        let outputName = `${Date.now()}.jtfc`;
        console.log(`* Saving jtf collection to '${outputName}'.`);
        fs.writeFile(`./${outputName}.jtfc`, out, saveCallback);
    };
};

const errorReport = (fulfilledArr, nonFulfilledArr) => {
    // Check for errors.
    if (nonFulfilledArr.length>0){
        logRed(`Error(s) while converting ${nonFulfilledArr.length} atf string(s) to jtf:`);
        nonFulfilledArr.forEach( jtf => console.log(`- ${jtf.reference}`));
    };
    let itemsWithErrors = fulfilledArr.filter( jtf => jtf.errors.length>0 );
    if (itemsWithErrors.length>0){
        logRed(`Error(s) found in ${itemsWithErrors.length} converted jtf object(s):`);
        itemsWithErrors.forEach( jtf => console.log(`- ${jtf.reference}`));
    };
};

const logRed = ( string ) => {
    // Red background in console.
    console.log("\x1b[41m", string, "\x1b[0m")
};

const abstractOutput = (fulfilledArr, argv) => {
    // Convert "abstract" representation, then save to file or pipe to stdout.
    let abstractArr = fulfilledArr.map( value => {
        return {
          reference: value.reference, 
          value: JTF2SignNames(value)
        }
    });
    let out = JSON.stringify(abstractArr);
    if (argv.pipe){
        console.log('* Serving "abstract" sign text collection');
        serve( out );
        //process.stdout.write(out);
        //var buffer = Buffer.alloc(Buffer.byteLength(out));
        //buffer.write(out);
    } else {
        let outputName = `${Date.now()}_normalized_signs`;
        console.log(`* Saving "abstract" sign text collection to '${outputName}.json'.`);
        fs.writeFile(`./${outputName}.json`, out, saveCallback);
    };
};


const saveCallback = (err, data) => { 
  //
  if (err) {
    return console.log(err);
  }
};

const serve = function ( out ) {
    // Serve data on localhost.
    const server = http.createServer(function (req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(out);
        res.end();
        terminate();
    }).listen(9000);
    const httpTerminator = createHttpTerminator({server});
    console.log('* Endpoint set to localhost:9000. Waiting for request...');
    let serverRunning = true;
    const terminate = async () => {
      await httpTerminator.terminate().then( () => {
          if (!serverRunning){ return; }
          console.log('* Data served. Closing endpoint')
          serverRunning = false;
      });
    };
};