
/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var Hash     = require('./hash')
var inherits = require('util').inherits
var BE       = false
var LE       = true
var hexpp    = require('./hexpp')
var to       = require('bops/typedarray/from')
var u        = require('./util')
//var assert   = require('assert')

module.exports = Sha256

var K = new Uint32Array([
    0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
    0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
    0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
    0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
    0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
    0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
    0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
    0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
    0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
    0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
    0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
    0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
    0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
    0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
    0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
    0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
  ]);

inherits(Sha256, Hash)

function Sha256() {
  this._data = new Uint32Array([
    0x67e6096a, 0x85ae67bb, 0x72f36e3c, 0x3af54fa5,
    0x7f520e51, 0x8c68059b, 0xabd9831f, 0x19cde05b
  ])

//  this._a = 0x67e6096a
//  this._b = 0x85ae67bb
//  this._c = 0x72f36e3c
//  this._d = 0x3af54fa5
//  this._e = 0x7f520e51
//
//  this._f = 0x8c68059b
//  this._h = 0xabd9831f
//  this._g = 0x19cde05b
//

  this._a = 0x6a09e667|0
  this._b = 0xbb67ae85|0
  this._c = 0x3c6ef372|0
  this._d = 0xa54ff53a|0
  this._e = 0x510e527f|0
  this._f = 0x9b05688c|0
  this._g = 0x1f83d9ab|0
  this._h = 0x5be0cd19|0

  var DV = this._dvH = new DataView(this._data.buffer)
  this._w = new Uint32Array(64);

  Hash.call(this, 16*4, 14*4)
};

var safe_add = function(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
};

var S = function(X, n) {
  return (X >>> n) | (X << (32 - n));
};

var R = function(X, n) {
  return (X >>> n);
};

var Ch = function(x, y, z) {
  return ((x & y) ^ ((~x) & z));
};

var Maj = function(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z));
};

var Sigma0256 = function(x) {
  return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
};

var Sigma1256 = function(x) {
  return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
};

var Gamma0256 = function(x) {
  return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
};

var Gamma1256 = function(x) {
  return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
};

Sha256.prototype._update = function(m) {
  var l = this._len
  var HASH = this._dvH
  var W = this._w
  var M = this._dv //M//new DataView(m.buffer || m);
  var a, b, c, d, e, f, g, h, i, j;
  var _a, _b, _c, _d, _e, _f, _g, _h
  var T1, T2;

  var i = 0

//  _a = a = HASH.getUint32( 0, BE);
//  _b = b = HASH.getUint32( 4, BE);
//  _c = c = HASH.getUint32( 8, BE);
//  _d = d = HASH.getUint32(12, BE);
//  _e = e = HASH.getUint32(16, BE);
//  _f = f = HASH.getUint32(20, BE);
//  _g = g = HASH.getUint32(24, BE);
//  _h = h = HASH.getUint32(28, BE);

//  assert.equal(this._a|0, a|0)

  _a = a = this._a | 0
  _b = b = this._b | 0
  _c = c = this._c | 0
  _d = d = this._d | 0
  _e = e = this._e | 0
  _f = f = this._f | 0
  _g = g = this._g | 0
  _h = h = this._h | 0

  for (var j = 0; j < 64; j++) {
    W[j]
      = j < 16
      ? M.getUint32(j * 4, BE)
      : safe_add(
          safe_add(
            safe_add(
              Gamma1256(W[j - 2]),
              W[j - 7]
            ),
            Gamma0256(W[j - 15])
          ),
          W[j - 16]
        );

    T1 = safe_add(
          safe_add(
            safe_add(
              safe_add(h, Sigma1256(e)),
              Ch(e, f, g)
            ),
            K[j]
          ),
          W[j]
        );

    T2 = safe_add(Sigma0256(a), Maj(a, b, c));
    h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
  }

//  HASH.setUint32( 0, safe_add(a, _a), BE);
//  HASH.setUint32( 4, safe_add(b, _b), BE);
//  HASH.setUint32( 8, safe_add(c, _c), BE);
//  HASH.setUint32(12, safe_add(d, _d), BE);
//  HASH.setUint32(16, safe_add(e, _e), BE);
//  HASH.setUint32(20, safe_add(f, _f), BE);
//  HASH.setUint32(24, safe_add(g, _g), BE);
//  HASH.setUint32(28, safe_add(h, _h), BE);

  this._a = safe_add(a, _a) | 0
  this._b = safe_add(b, _b) | 0
  this._c = safe_add(c, _c) | 0
  this._d = safe_add(d, _d) | 0
  this._e = safe_add(e, _e) | 0
  this._f = safe_add(f, _f) | 0
  this._g = safe_add(g, _g) | 0
  this._h = safe_add(h, _h) | 0

};

Sha256.prototype._hash = function () {

  var H = this._dvH

  H.setUint32( 0, this._a, BE);
  H.setUint32( 4, this._b, BE);
  H.setUint32( 8, this._c, BE);
  H.setUint32(12, this._d, BE);
  H.setUint32(16, this._e, BE);
  H.setUint32(20, this._f, BE);
  H.setUint32(24, this._g, BE);
  H.setUint32(28, this._h, BE);

  return H
}
