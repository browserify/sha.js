'use strict'
var inherits = require('inherits')
var HashBase = require('hash-base')
var padding = require('./padding')

var W = new Array(80)
var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6]

function SHA () {
  HashBase.call(this, 64)

  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0
}

inherits(SHA, HashBase)

SHA.prototype._expandMessage = function (W) {
  for (var i = 0; i < 16; ++i) W[i] = this._block.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]
}

SHA.prototype._update = function () {
  this._expandMessage(W)

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 80; ++i) {
    var t
    if (i < 20) {
      t = (e + fn0(b, c, d) + rotl5(a) + W[i] + K[0]) | 0
    } else if (i < 40) {
      t = (e + fn1(b, c, d) + rotl5(a) + W[i] + K[1]) | 0
    } else if (i < 60) {
      t = (e + fn2(b, c, d) + rotl5(a) + W[i] + K[2]) | 0
    } else { // i < 80
      t = (e + fn1(b, c, d) + rotl5(a) + W[i] + K[3]) | 0
    }

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

SHA.prototype._digest = function () {
  padding.block64.call(this)

  var buffer = new Buffer(20)
  buffer.writeInt32BE(this._a, 0)
  buffer.writeInt32BE(this._b, 4)
  buffer.writeInt32BE(this._c, 8)
  buffer.writeInt32BE(this._d, 12)
  buffer.writeInt32BE(this._e, 16)
  return buffer
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function fn0 (b, c, d) {
  return (b & c) | ((~b) & d)
}

function fn1 (b, c, d) {
  return b ^ c ^ d
}

function fn2 (b, c, d) {
  return (b & c) | (b & d) | (c & d)
}

module.exports = SHA
