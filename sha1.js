/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var inherits = require('inherits')
var Hash = require('./hash')

var W = new Array(80)

function Sha1() {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha1, Hash)

Sha1.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

Sha1.prototype._update = function (M) {
  var W = this._w

  var a = this._a
  var b = this._b
  var c = this._c
  var d = this._d
  var e = this._e

  var w, f, k, t, j = 0
  while (j < 16) {
    w = W[j] = M.readInt32BE(j * 4)
    f = (b & c) | ((~b) & d)
    k = 1518500249
    t = (rol(a, 5) + f + e + w + k) | 0

    e = d
    d = c
    c = rol(b, 30)
    b = a
    a = t

    j++
  }

  while (j < 20) {
    w = W[j] = rol(W[j - 3] ^ W[j -  8] ^ W[j - 14] ^ W[j - 16], 1)
    f = (b & c) | ((~b) & d)
    k = 1518500249
    t = (rol(a, 5) + f + e + w + k) | 0

    e = d
    d = c
    c = rol(b, 30)
    b = a
    a = t

    j++
  }

  while (j < 40) {
    w = W[j] = rol(W[j - 3] ^ W[j -  8] ^ W[j - 14] ^ W[j - 16], 1)
    f = b ^ c ^ d
    k = 1859775393
    t = (rol(a, 5) + f + e + w + k) | 0

    e = d
    d = c
    c = rol(b, 30)
    b = a
    a = t

    j++
  }

  while (j < 60) {
    w = W[j] = rol(W[j - 3] ^ W[j -  8] ^ W[j - 14] ^ W[j - 16], 1)
    f = (b & c) | (b & d) | (c & d)
    k = -1894007588
    t = (rol(a, 5) + f + e + w + k) | 0

    e = d
    d = c
    c = rol(b, 30)
    b = a
    a = t

    j++
  }

  while (j < 80) {
    w = W[j] = rol(W[j - 3] ^ W[j -  8] ^ W[j - 14] ^ W[j - 16], 1)
    f = b ^ c ^ d
    k = -899497514
    t = (rol(a, 5) + f + e + w + k) | 0

    e = d
    d = c
    c = rol(b, 30)
    b = a
    a = t

    j++
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha1.prototype._hash = function () {
  var H = new Buffer(20)

  H.writeInt32BE(this._a|0, 0)
  H.writeInt32BE(this._b|0, 4)
  H.writeInt32BE(this._c|0, 8)
  H.writeInt32BE(this._d|0, 12)
  H.writeInt32BE(this._e|0, 16)

  return H
}

module.exports = Sha1

