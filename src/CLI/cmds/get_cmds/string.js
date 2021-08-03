#!/usr/bin/env node

const { ATF2JTF, ATFLine2JTF } = require('../../../Converters/ATF2JTF.js');
//const { JTF2SignNames, ATFLine2SignNames } = require('../../../Converters/JTF2SignNames.js');
const { postprocess } = require('../get.js');

exports.command = 'string [line] [pipe] [abstract] <string>';
exports.desc = '';
exports.builder = {
  string: {
    type: 'string',
    desc: 'ATF(-like) string',
  },
  line: {
    alias: ['l'],
    type: 'boolean',
    default: false,
    desc: 'ATF inline string for a single line',
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
  if (argv.line && argv.abstract){
    postprocess(ATFLine2JTF(argv.string), argv);
  } else {
    postprocess(ATF2JTF(argv.string), argv);
  }
};