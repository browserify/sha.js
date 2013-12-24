/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

module.exports = Sha

function Sha () {
  
  //|0 coearses to Int32
  var h = this._h = new Uint32Array(5)
  h[0] = 0x67452301|0
  h[1] = 0xefcdab89|0
  h[2] = 0x98badcfe|0
  h[3] = 0x10325476|0
  h[4] = 0xc3d2e1f0|0

  this._w = new Uint32Array(80)
  this._x = new Uint32Array(16)
  this._len = 0
}


//write a string into an array, in either big or little endian mode.
//you can create a Uint32 view on bytes with typed arrays,
//new Uint32Array(uint8array.buffer)
//but unfortunately, it's littleendian.
//(as far as I can tell, am offline currently,
// will look up docs when connected)

Sha.write = write
Sha.reverseByteOrder = reverseByteOrder


function write (buffer, string, enc, start, from, to, LE) {

  if(enc !== 'ascii')
    throw new Error('only ascii is supported, for now')

  var l = to - from

  for( var i = 0; i < l; i++) {
    //iterate in bigendian order.
    var byte = (i&0xfffffffc)|(LE ? i%4 : 3 - i%4)
    buffer[start + byte] = string.charCodeAt(i + from)
  }

}


function reverseByteOrder(n) {
  return (
    ((n & 0xff) << 24)
  | ((n & 0xff00) << 8)
  | ((n & 0xff0000) >>  8)
  | ((n & 0xff000000) >>  24)
  )
}

Sha.prototype.update = function (data, enc) {
  //convert to array of ints.
  //since this is probably a string, copy it into the array,
  //if it's over 16 words (and so, we have filled _i)
  //then call _update(). if it's equal less, we have to wait,
  //because this might be the last block, and so we have to wait for final()

  //for encoding/decoding utf8, see here:
  //https://github.com/chrisdickinson/bops/blob/master/typedarray/from.js#L36-L57
  //https://github.com/chrisdickinson/to-utf8

  //for now, assume ascii.
  var start = this._l || 0
  this._len += data.length
  console.log('update', this._len)
  if(data.length < 512 - start) {
    this._l = Math.min(512, start + data.length)
    write(this._x.buffer, data, 'ascii', start, 0, this._l)
  }
  return this
}

Sha.prototype.final = function () {
  //do the sha stuff to the end of the message array.
  console.log('final', this._len)
  var x = this._x, len = this._len*8
  console.log('x[len >> 5]', x[len >> 5], x[len >> 5] | (0x80 << (24 - len % 32))) | 0
  x[len >> 5] |= 0x80 << (24 - len % 32);
  console.log('x[len >> 5]', x[len >> 5], x[len >> 5] | (0x80 << (24 - len % 32))) | 0
  console.log(this._x)
  x[((len + 64 >> 9) << 4) + 15] = len;
  console.log(toHex(this._x))
  this._update()
  return this
}

function toHex (buf) {
  buf = buf.buffer || buf
  var s = ''
  for(var i = 0; i < buf.byteLength; i++)
    s += ((buf[i]>>4).toString(16)) + ((buf[i]&0xf).toString(16))
  return s

}

Sha.prototype.digest = function () {
  this.final()

  var h = this._h

  //reverse byte order, so that the individual bytes are in correct order.
  h[0] = reverseByteOrder(h[0])
  h[1] = reverseByteOrder(h[1])
  h[2] = reverseByteOrder(h[2])
  h[3] = reverseByteOrder(h[3])
  h[4] = reverseByteOrder(h[4])

  return toHex(this._h.buffer)
}

// assume that array is a Uint32Array with length=16,
// and that if it is the last block, it already has the length and the 1 bit appended.

var A = 0
var B = 1
var C = 2
var D = 3
var E = 4

Sha.prototype._update = function (array) {

  var h = this._h
  var a = _a = h[A]
  var b = _b = h[B]
  var c = _c = h[C]
  var d = _d = h[D]
  var e = _e = h[E]

  var i = 0
  var w = this._w
  var x = this._x
console.log('INIT-sha1', toHex(new Int32Array([a, b, c, d, e])))

  for(var j = 0; j < 80; j++)
  {
    if(j < 16) w[j] = x[i + j];
    else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
    var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                     safe_add(safe_add(e, w[j]), sha1_kt(j)));
    e = d;
    d = c;
    c = rol(b, 30);
    b = a;
    a = t;
  }
  console.log('ROUND-sha1', toHex(new Int32Array([a, b, c, d, e])))

  h[A] = safe_add(a, _a);
  h[B] = safe_add(b, _b);
  h[C] = safe_add(c, _c);
  h[D] = safe_add(d, _d);
  h[E] = safe_add(e, _e);

}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  console.log('INIT-core', toHex(x))

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  console.log('INIT', toHex(new Int32Array([a, b, c, d, e])))

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }
    console.log('ROUND-core', toHex(new Int32Array([a, b, c, d, e])))

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }

//  return [a, b, c, d, e]
  return new Int32Array([a, b, c, d, e]);

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

if(!module.parent) {
  var crypto = require('crypto')
  var _H = new Sha().update('hello there.', 'ascii').digest('hex')
  var H2 = crypto.createHash('sha1').update('hello there.', 'ascii').digest('hex')
  console.error('SHA1', _H)
  var a = new Uint32Array(16)

  write(a.buffer, 'hello there.', 'ascii', 0, 0, 12)
  console.error('buff-xxxx', toHex(a.buffer))
  var H = toHex(core_sha1(a, 12*8))
  console.error('CORE', H)
  console.error('OSSL', H2)

  if(H === _H && H === H2)
    console.log('SUCCESS!')
}
