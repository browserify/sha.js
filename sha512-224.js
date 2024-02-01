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
  this._ah = 0x8c3d37c8
  this._bh = 0x73e19966
  this._ch = 0x1dfab7ae
  this._dh = 0x679dd514
  this._eh = 0x0f6d2b69
  this._fh = 0x77e36f73
  this._gh = 0x3f9d85a8
  this._hh = 0x1112e6ad

  this._al = 0x19544da2
  this._bl = 0x89dcd4d6
  this._cl = 0x32ff9c82
  this._dl = 0x582f9fcf
  this._el = 0x7bd44da8
  this._fl = 0x04c48942
  this._gl = 0x6a1d36c8
  this._hl = 0x91d692a1

  return this
}

Sha512h256.prototype._hash = function () {
  var H = Buffer.allocUnsafe(28)

  H.writeInt32BE(this._ah, 0)
  H.writeInt32BE(this._al, 4)
  H.writeInt32BE(this._bh, 8)
  H.writeInt32BE(this._bl, 12)
  H.writeInt32BE(this._ch, 16)
  H.writeInt32BE(this._cl, 20)
  H.writeInt32BE(this._dh, 24)

  return H
}

module.exports = Sha512h256
