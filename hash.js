var u = require('./util')
var hexpp = require('./hexpp')

module.exports = Hash

//prototype class for hash functions
function Hash (blockSize) {
  this._block = new Uint32Array(blockSize/4)
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
    u.write(this._block.buffer, data, 'ascii', l%bl, f, t)
    s += (t - f)
    if(!(s%bl))
      this._update(this._block.buffer)
  }

  console.log('---WRITTEN---')
  console.log(hexpp(this._block))
  return this

}

Hash.prototype.digest = function (enc) {
  return u.toHex(this._final())
  //reverse byte order, so that the individual bytes are in correct order.
//  return u.toHex(this._hash.buffer)
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

Hash.prototype._final = function () {
  throw new Error('_final must be implemented by subclass')
}


