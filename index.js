/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
var hexpp = require('./hexpp').defaults({bigendian: true})

var u = require('./util')
var reverseByteOrder = u.reverseByteOrder
var zeroFill = u.zeroFill
module.exports = Sha

var inherits = require('util').inherits
var Hash = require('./hash')

inherits(Sha, Hash)

function Sha () {
  
  //|0 coearses to Int32
  var h = this._h = new Uint32Array(5)

  h[0] = 0x67452301|0
  h[1] = 0xefcdab89|0
  h[2] = 0x98badcfe|0
  h[3] = 0x10325476|0
  h[4] = 0xc3d2e1f0|0
  this._w = new Uint32Array(80)
  Hash.call(this, 16*4)

  this._dvX = new DataView(this._block.buffer)
  this._dvW = new DataView(this._w.buffer)
  this._dvH = new DataView(this._h.buffer)

  this._x = this._block
  this._len = 0

}

Sha.prototype._final = function () {
  //do the sha stuff to the end of the message array.
  var x = this._x, len = this._len*8
  
  var bits = len % 512
  var append = bits >> 5
  var bit = (0x80 << (24 - len % 32))
  console.log(bit, append, bits)

  console.log('--- final ---')
  console.log(hexpp(x))

  if(len === 0 || (bits && bits < 448)) {
    x[append] |= bit;
  }
  else if(bits >= 448) {
    x[append] |= bit;
    this._update()
    zeroFill(this._x, 0)
  }
  //edge case where message is multiple of 512 bits long
  else if(bits === 0) {
    this._update()
    zeroFill(this._x.buffer, 0)
    //len = this._len += 448
    x[append] |= bit;
  }

  x[15] = len
  console.log('--- addLed ---')
  console.log(hexpp(x))
  this._update()

  //reorder bytes to little endian...
  var h = this._h
  console.log(hexpp(this._h.buffer))
  h[0] = reverseByteOrder(h[0])
  h[1] = reverseByteOrder(h[1])
  h[2] = reverseByteOrder(h[2])
  h[3] = reverseByteOrder(h[3])
  h[4] = reverseByteOrder(h[4])

  return this
}


// assume that array is a Uint32Array with length=16,
// and that if it is the last block, it already has the length and the 1 bit appended.

var A = 0
var B = 4
var C = 8
var D = 12
var E = 16

var BE = true

Sha.prototype._update = function (array) {

  var q = true

  var X = this._dvX
  var W = this._dvW
  var H = this._dvH
  
  var h = this._h
  var a = _a = H.getUint32(A, q)
  var b = _b = H.getUint32(B, q)
  var c = _c = H.getUint32(C, q)
  var d = _d = H.getUint32(D, q)
  var e = _e = H.getUint32(E, q)

  var i = 0
  var w = this._w
  var x = this._x

  console.log('--- Update ---')
  console.log(hexpp(x))

  for(var j = 0; j < 80; j++)
  {
    if(j < 16)
      W.setUint32(j*4, X.getUint32((i + j)*4, BE), BE)
    else
      W.setUint32(
        j*4,
        rol(
          W.getUint32((j -  3)*4, BE)
        ^ W.getUint32((j -  8)*4, BE)
        ^ W.getUint32((j - 14)*4, BE)
        ^ W.getUint32((j - 16)*4, BE),
        1),
        true
      )

    var t =
      safe_add(
        safe_add(
          rol(a, 5),
          sha1_ft(j, b, c, d)
        ),
        safe_add(
          safe_add(e, W.getUint32(j*4, BE)),
          sha1_kt(j)
        )
      );

    e = d
    d = c
    c = rol(b, 30)
    b = a
    a = t
  }

  H.setUint32(A, safe_add(a, _a), q)
  H.setUint32(B, safe_add(b, _b), q)
  H.setUint32(C, safe_add(c, _c), q)
  H.setUint32(D, safe_add(d, _d), q)
  H.setUint32(E, safe_add(e, _e), q)
//
//  h[0] = safe_add(a, _a)
//  h[1] = safe_add(b, _b)
//  h[2] = safe_add(c, _c)
//  h[3] = safe_add(d, _d)
//  h[4] = safe_add(e, _e)
  
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

