var exports = module.exports = function SHA (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.sha = require('./lib/sha')
exports.sha1 = require('./lib/sha1')
exports.sha224 = require('./lib/sha224')
exports.sha256 = require('./lib/sha256')
exports.sha384 = require('./lib/sha384')
exports.sha512 = require('./lib/sha512')
