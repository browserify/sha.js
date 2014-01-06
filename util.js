exports.write = write
exports.toHex = toHex
exports.zeroFill = zeroFill

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
  if(enc === 'ascii' || enc === 'binary') {
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

function toBinary (buf) {
  var s = ''
  var l = 'string' === typeof buf ? buf.length : buf.byteLength
  var s = ''
  for(var i = 0; i < l; i++) {
    var char = buf.charCodeAt ? buf.charCodeAt(i) :  buf[i]
    s += String.fromCharCode(char)
  }
  return s
}

//always fill to the end!
function zeroFill(buf, from) {
  for(var i = from; i < buf.byteLength; i++)
    buf[i] = 0
}

function toString(buf, enc) {
  if(null == enc) return buf
  if('hex' == enc)
    return toHex(buf)
  if('binary' == enc)
    return toBinary(buf)
  return bopsToString(buf, enc)
}
