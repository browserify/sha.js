var u = require('./util')
var hexpp = require('./hexpp').defaults({bigendian: false})

module.exports = Hash

//prototype class for hash functions
function Hash (blockSize, finalSize) {
  this._block = new Uint32Array(blockSize/4)
  this._dv = new DataView(this._block.buffer)
  this._finalSize = finalSize
  this._len = 0
  this._l = 0
}

Hash.prototype.update = function (data, enc) {
  //convert to array of ints.
  //since this is probably a string, copy it into the array,
  //if it's over 16 words (and so, we have filled _i)
  //then call _update(). if it's equal less, we have to wait,
  //because this might be the last block, and so we have to wait for final()

  //for encoding/decoding utf8, see here:
  //https://github.com/chrisdickinson/bops/blob/master/typedarray/from.js#L36-L57
  //https://github.com/chrisdickinson/to-utf8
  var bl = this._block.byteLength
  //for now, assume ascii.

  var l = this._len += data.length
  var s = this._s = (this._s || 0)
  var f = 0
  while(s < l) {
    var t = Math.min(data.length, f + bl)
    u.write(this._block.buffer, data, 'ascii', s%bl, f, t, true)
    s += (t - f)

    if(!(s%bl)) {
      this._update(this._block.buffer)
      u.zeroFill(this._block.buffer, 0)
    }

  }
  this._s = s

  return this

}

Hash.prototype.digest = function (enc) {
  //how much message is leftover
  var bl = this._block.byteLength
  var fl = this._finalSize
  var len = this._len*8

  var x = this._block.buffer
  var X = this._dv

  var bits = len % (bl*8)

  //add end marker, so that appending 0's creats a different hash.
  x[this._len % bl] = 0x80
  console.log('--- final ---', bits, fl, this._len % bl, fl + 4, fl*8, bits >= fl*8)
  console.log(hexpp(x))
  
  if(bits >= fl*8) {
    this._update(this._block.buffer)
    u.zeroFill(this._block, 0)
  }

  //TODO: handle case where the bit length is > Math.pow(2, 29)
  X.setUint32(fl + 4, len, false) //big endian

  var hash = this._update(this._block.buffer)
  if(!enc) return hash
  return u.toHex(hash)
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

Hash.prototype._final = function () {
  throw new Error('_final must be implemented by subclass')
}


