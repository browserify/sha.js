exports.write = write
exports.reverseByteOrder = reverseByteOrder
exports.toHex = toHex
exports.zeroFill = zeroFill
exports.Uint32toHex = Uint32toHex
exports.toString = toString
var bopsToString = require('bops/typedarray/to')
//change me: args should be:
//buffer, string, enc, string_start, buffer_start
//write will write as much of string into buffer as possible, and return the new length.
//no. that is not enough... because of utf8.
//HMM

//I think this is just too coupled to be separate.
//for utf8 you also need the state of the character...

//the simplest way would be to just convert the utf8 to a buffer first.
//not optimal, though...

//OKAY, I should have benchmarks before I worry about that.

function write (buffer, string, enc, start, from, to, LE) {
  var l = (to - from)
  if(enc === 'ascii') {
    for( var i = 0; i < l; i++) {
      buffer[start + i] = string.charCodeAt(i + from)
    }
  }
  else if(enc == null) {
    for( var i = 0; i < l; i++) {
      buffer[start + i] = string[i + from]
    }
  }
  else if(enc === 'hex') {
    for(var i = 0; i < l; i++) {
      var j = from + i
      buffer[start + i] = parseInt(string[j*2] + string[(j*2)+1], 16)
    }
  }
  else if(enc === 'base64') {
    throw new Error('base64 encoding not yet supported')
  }
  else
    throw new Error(enc +' encoding not yet supported')
}

function toHex (buf) {
  buf = buf.buffer || buf
  var l = 'string' === typeof buf ? buf.length : buf.byteLength
  var s = ''
  for(var i = 0; i < l; i++) {
    var char = buf.charCodeAt ? buf.charCodeAt(i) : buf[i]
    s += ((char>>4).toString(16)) + ((char&0xf).toString(16))
  }
  return s
}


function reverseByteOrder(n) {
  return (
    ((n << 24) & 0xff000000)
  | ((n <<  8) & 0x00ff0000)
  | ((n >>  8) & 0x0000ff00)
  | ((n >> 24) & 0x000000ff)
  )
}

//always fill to the end!
function zeroFill(buf, from) {
  for(var i = from; i < buf.byteLength; i++)
    buf[i] = 0
}


function Uint32toHex (n) {
  var s = (n & 0x0f).toString(16)
      s = ((n >>= 4) & 0x0f).toString(16) + s
      s = ((n >>= 4) & 0x0f).toString(16) + s
      s = ((n >>= 4) & 0x0f).toString(16) + s
      s = ((n >>= 4) & 0x0f).toString(16) + s
      s = ((n >>= 4) & 0x0f).toString(16) + s
      s = ((n >>= 4) & 0x0f).toString(16) + s
      s = ((n >>= 4) & 0x0f).toString(16) + s
  return s
}


function toString(buf, enc) {
  if(null == enc) return buf
  return bopsToString(buf, enc)
}
