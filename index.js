var exports = module.exports = function (alg) {
  var Alg = exports[alg]
  if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
  return new Alg()
}

var Buffer = require('buffer').Buffer
var Hash   = require('./hash')(Buffer)

exports.sha1 = require('./sha1')(Buffer, Hash)
exports.sha224 = require('./sha224')(Buffer, Hash)
exports.sha256 = require('./sha256')(Buffer, Hash)
exports.sha384 = require('./sha384')(Buffer, Hash)
exports.sha512 = require('./sha512')(Buffer, Hash)
