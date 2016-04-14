'use strict'
var inherits = require('inherits')
var HashBase = require('hash-base')
var SHA256 = require('./sha256')
var padding = require('./padding')

function SHA224 () {
  HashBase.call(this, 64)

  this._a = 0xc1059ed8
  this._b = 0x367cd507
  this._c = 0x3070dd17
  this._d = 0xf70e5939
  this._e = 0xffc00b31
  this._f = 0x68581511
  this._g = 0x64f98fa7
  this._h = 0xbefa4fa4
}

inherits(SHA224, HashBase)

SHA224.prototype._update = SHA256.prototype._update

SHA224.prototype._digest = function () {
  padding.block64.call(this)

  var buffer = new Buffer(28)
  buffer.writeInt32BE(this._a, 0)
  buffer.writeInt32BE(this._b, 4)
  buffer.writeInt32BE(this._c, 8)
  buffer.writeInt32BE(this._d, 12)
  buffer.writeInt32BE(this._e, 16)
  buffer.writeInt32BE(this._f, 20)
  buffer.writeInt32BE(this._g, 24)
  return buffer
}

module.exports = SHA224
