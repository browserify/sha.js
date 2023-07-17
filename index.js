const supportedAlgorithms = {};
module.exports = function SHA (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = supportedAlgorithms[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

module.exports.sha = supportedAlgorithms.sha = require('./sha')
module.exports.sha1 = supportedAlgorithms.sha1 = require('./sha1')
module.exports.sha224 = supportedAlgorithms.sha224 = require('./sha224')
module.exports.sha256 = supportedAlgorithms.sha256 = require('./sha256')
module.exports.sha384 = supportedAlgorithms.sha384 = require('./sha384')
module.exports.sha512 = supportedAlgorithms.sha512 = require('./sha512')
