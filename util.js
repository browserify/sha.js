exports.write = write
exports.reverseByteOrder = reverseByteOrder
exports.toHex = toHex
exports.zeroFill = zeroFill
exports.Uint32toHex = Uint32toHex

//write a string into an array, in either big or little endian mode.
//you can create a Uint32 view on bytes with typed arrays,
//new Uint32Array(uint8array.buffer)
//but unfortunately, it's littleendian.
//(as far as I can tell, am offline currently,
// will look up docs when connected)

function write (buffer, string, enc, start, from, to, LE) {

  if(enc !== 'ascii')
    throw new Error('only ascii is supported, for now')

  var l = (to - from)

  for( var i = 0; i < l; i++) {
    //iterate in bigendian order.
    var j = start + i
    var byte = (j&0xfffffffc)|(LE ? j%4 : 3 - j%4)
    console.log('byte', byte, string[i + from], string.charCodeAt(i + from).toString(16))
    buffer[byte] = string.charCodeAt(i + from)
  }

}

function toHex (buf, groups) {
  buf = buf.buffer || buf
  var s = ''
  for(var i = 0; i < buf.byteLength; i++)
    s += ((buf[i]>>4).toString(16)) + ((buf[i]&0xf).toString(16)) + (groups-1==i%groups ? ' ' : '')
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

