exports.command = 'get <source>'
exports.desc = 'Import JTF data'
exports.builder = function (yargs) {
  return yargs.commandDir('get_cmds')
}
exports.handler = function (argv) {}