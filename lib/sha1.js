'use strict'
var inherits = require('inherits')
var HashBase = require('hash-base')
var SHA = require('./sha')

function SHA1 () {
  SHA.call(this)
}

inherits(SHA1, HashBase)

SHA1.prototype._expandMessage = function (W) {
  for (var i = 0; i < 16; ++i) W[i] = this._block.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])
}

SHA1.prototype._update = SHA.prototype._update
SHA1.prototype._digest = SHA.prototype._digest

function rotl1 (num) {
  return (num << 1) | (num >>> 31)
}

module.exports = SHA1
