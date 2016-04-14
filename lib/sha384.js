'use strict'
var inherits = require('inherits')
var HashBase = require('hash-base')
var SHA512 = require('./sha512')
var padding = require('./padding')

function SHA384 () {
  HashBase.call(this, 128)

  this._ah = 0xcbbb9d5d
  this._bh = 0x629a292a
  this._ch = 0x9159015a
  this._dh = 0x152fecd8
  this._eh = 0x67332667
  this._fh = 0x8eb44a87
  this._gh = 0xdb0c2e0d
  this._hh = 0x47b5481d

  this._al = 0xc1059ed8
  this._bl = 0x367cd507
  this._cl = 0x3070dd17
  this._dl = 0xf70e5939
  this._el = 0xffc00b31
  this._fl = 0x68581511
  this._gl = 0x64f98fa7
  this._hl = 0xbefa4fa4
}

inherits(SHA384, HashBase)

SHA384.prototype._update = SHA512.prototype._update

SHA384.prototype._digest = function () {
  padding.block128.call(this)

  var buffer = new Buffer(48)
  buffer.writeInt32BE(this._ah, 0)
  buffer.writeInt32BE(this._al, 4)
  buffer.writeInt32BE(this._bh, 8)
  buffer.writeInt32BE(this._bl, 12)
  buffer.writeInt32BE(this._ch, 16)
  buffer.writeInt32BE(this._cl, 20)
  buffer.writeInt32BE(this._dh, 24)
  buffer.writeInt32BE(this._dl, 28)
  buffer.writeInt32BE(this._eh, 32)
  buffer.writeInt32BE(this._el, 36)
  buffer.writeInt32BE(this._fh, 40)
  buffer.writeInt32BE(this._fl, 44)
  return buffer
}

module.exports = SHA384
