var exports = module.exports = function (alg) {
  var Alg = exports[alg]
  if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
  return new Alg()
}

exports.sha =
exports.sha1 = require('./sha1')
exports.sha256 = require('./sha256')
