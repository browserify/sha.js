/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
module.exports = Sha1

var inherits = require('util').inherits
var Hash = require('./hash')

inherits(Sha1, Hash)

var A = 0
var B = 4
var C = 8
var D = 12
var E = 16

var BE = false
var LE = true

function Sha1 () {
  if(!(this instanceof Sha1)) return new Sha1()

  this._w = new Uint32Array(80)
  Hash.call(this, 16*4, 14*4)
  
  this._h = new Uint8Array(20)
  var H = this._dvH = new DataView(this._h.buffer)
  this._h32 = new Uint32Array(this._h.buffer)

  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  this._len = 0
}


// assume that array is a Uint32Array with length=16,
// and that if it is the last block, it already has the length and the 1 bit appended.

Sha1.prototype._update = function (array) {

  var X = this._dv
  var H = this._dvH

  var h = this._h
  var a, b, c, d, e, _a, _b, _c, _d, _e

  a = _a = this._a
  b = _b = this._b
  c = _c = this._c
  d = _d = this._d
  e = _e = this._e

  var w = this._w

  for(var j = 0; j < 80; j++) {
    var W = w[j]
      = j < 16
      ? X.getUint32(j*4, BE)
      : rol(w[j - 3] ^ w[j -  8] ^ w[j - 14] ^ w[j - 16], 1)

    var t =
      add(
        add(rol(a, 5), sha1_ft(j, b, c, d)),
        add(add(e, W), sha1_kt(j))
      );

    e = d
    d = c
    c = rol(b, 30)
    b = a
    a = t
  }

  this._a = add(a, _a)
  this._b = add(b, _b)
  this._c = add(c, _c)
  this._d = add(d, _d)
  this._e = add(e, _e)
}

Sha1.prototype._hash = function () {
  var H = this._dvH //new DataView(new ArrayBuffer(20))
  H.setUint32(A, this._a, BE)
  H.setUint32(B, this._b, BE)
  H.setUint32(C, this._c, BE)
  H.setUint32(D, this._d, BE)
  H.setUint32(E, this._e, BE)
  return H
}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 * //dominictarr: this is 10 years old, so maybe this can be dropped?)
 *
 */
function add(x, y) {
  return (x + y ) | 0
//lets see how this goes on testling.
//  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
//  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
//  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

