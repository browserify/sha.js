var exports = module.exports = function SHA (algorithm) {
  algorithm = algorithm.toUpperCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.SHA = require('./lib/sha')
exports.SHA1 = require('./lib/sha1')
exports.SHA224 = require('./lib/sha224')
exports.SHA256 = require('./lib/sha256')
exports.SHA384 = require('./lib/sha384')
exports.SHA512 = require('./lib/sha512')
