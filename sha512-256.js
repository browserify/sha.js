var inherits = require('inherits')
var Sha512 = require('./sha512')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var W = new Array(160)

function Sha512h256 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha512h256, Sha512)

Sha512h256.prototype.init = function () {
  this._ah = 0x22312194
  this._bh = 0x9f555fa3
  this._ch = 0x2393b86b
  this._dh = 0x96387719
  this._eh = 0x96283ee2
  this._fh = 0xbe5e1e25
  this._gh = 0x2b0199fc
  this._hh = 0x0eb72ddc

  this._al = 0xfc2bf72c
  this._bl = 0xc84c64c2
  this._cl = 0x6f53b151
  this._dl = 0x5940eabd
  this._el = 0xa88effe3
  this._fl = 0x53863992
  this._gl = 0x2c85b8aa
  this._hl = 0x81c52ca2

  return this
}

Sha512h256.prototype._hash = function () {
  var H = Buffer.allocUnsafe(32)

  H.writeInt32BE(this._ah, 0)
  H.writeInt32BE(this._al, 4)
  H.writeInt32BE(this._bh, 8)
  H.writeInt32BE(this._bl, 12)
  H.writeInt32BE(this._ch, 16)
  H.writeInt32BE(this._cl, 20)
  H.writeInt32BE(this._dh, 24)
  H.writeInt32BE(this._dl, 28)

  return H
}

module.exports = Sha512h256
