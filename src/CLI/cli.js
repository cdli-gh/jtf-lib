#!/usr/bin/env node

const yargs = require("yargs");

yargs
  .scriptName("jtf")
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv