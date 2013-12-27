/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
var hexpp = require('./hexpp').defaults({bigendian: false})

var u = require('./util')
var reverseByteOrder = u.reverseByteOrder
var zeroFill = u.zeroFill
module.exports = Sha

var inherits = require('util').inherits
var Hash = require('./hash')

inherits(Sha, Hash)

var q = false
var A = 0
var B = 4
var C = 8
var D = 12
var E = 16

var BE = false
var LE = true

function Sha () {
  
  //|0 coearses to Int32
  var h = this._h = new Uint32Array(5)

  this._w = new Uint32Array(80)
  Hash.call(this, 16*4, 14*4)

  this._dvX = this._dv //new DataView(this._block.buffer)
  this._dvW = new DataView(this._w.buffer)
  var H = this._dvH = new DataView(this._h.buffer)

  H.setUint32(A, 0x01234567, LE)
  H.setUint32(B, 0x89abcdef, LE)
  H.setUint32(C, 0xfedcba98, LE)
  H.setUint32(D, 0x76543210, LE)
  H.setUint32(E, 0xf0e1d2c3, LE)

  this._x = this._block
  this._len = 0

}


// assume that array is a Uint32Array with length=16,
// and that if it is the last block, it already has the length and the 1 bit appended.

Sha.prototype._update = function (array) {

  var X = this._dvX
  var W = this._dvW
  var H = this._dvH
  
  var h = this._h
  var a = _a = H.getUint32(A, BE)
  var b = _b = H.getUint32(B, BE)
  var c = _c = H.getUint32(C, BE)
  var d = _d = H.getUint32(D, BE)
  var e = _e = H.getUint32(E, BE)

  var i = 0
  var w = this._w
  var x = this._x

  console.log('--- Update ---')
  console.log(hexpp(x))

  for(var j = 0; j < 80; j++)
  {
    if(j < 16)
      w[j] = X.getUint32((i + j)*4, BE)
    else
      w[j] = rol(w[j - 3] ^ w[j -  8] ^ w[j - 14] ^ w[j - 16], 1)
        

    var t =
      safe_add(
        safe_add(
          rol(a, 5),
          sha1_ft(j, b, c, d)
        ),
        safe_add(
          safe_add(e, w[j]),
          sha1_kt(j)
        )
      );

    e = d
    d = c
    c = rol(b, 30)
    b = a
    a = t
  }

  H.setUint32(A, safe_add(a, _a), BE)
  H.setUint32(B, safe_add(b, _b), BE)
  H.setUint32(C, safe_add(c, _c), BE)
  H.setUint32(D, safe_add(d, _d), BE)
  H.setUint32(E, safe_add(e, _e), BE)

  return H.buffer
}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

