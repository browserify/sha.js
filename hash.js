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

  //for now, assume ascii.
  var start = this._l || 0
  this._len += data.length
  console.log('update', JSON.stringify(data), start, data.length)
  var bl = this._block.byteLength

  if(data.length <= bl - start) {
    u.write(this._x.buffer, data, 'ascii', start, 0, data.length)
    this._l = (this._l || 0) + data.length
  }
  else {
    var from = 0
    var to = (from + bl) - this._l
    while(from < data.length) {
      console.log('OVERFLOW')
      u.write(this._x.buffer, data, 'ascii', this._l % bl, from, to)
      from = to
      to = Math.min(bl - this._l, data.length)
      this._update()
      this._l = 0
    }
  }
  console.log('---WRITTEN---')
  console.log(hexpp(this._x))
  return this

}

Hash.prototype.digest = function (enc) {
  this._final()
  //reverse byte order, so that the individual bytes are in correct order.
  return u.toHex(this._h.buffer)

}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

Hash.prototype._final = function () {
  throw new Error('_final must be implemented by subclass')
}


