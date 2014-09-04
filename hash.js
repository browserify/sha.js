module.exports = function (Buffer) {

  //prototype class for hash functions
  function Hash (blockSize, finalSize) {
    this._block = new Buffer(blockSize) //new Uint32Array(blockSize/4)
    this._finalSize = finalSize
    this._blockSize = blockSize
    this._len = 0
    this._s = 0
  }

  Hash.prototype.init = function () {
    this._s = 0
    this._len = 0
  }

  Hash.prototype.update = function (data, enc) {
    var bl = this._blockSize

    if ("string" === typeof data) {
      enc = enc || "utf8"
      data = new Buffer(data, enc)
    }

    var length = data.length

    var l = this._len += length
    var s = this._s = (this._s || 0)
    var f = 0
    var buffer = this._block
    while(s < l) {
      var t = Math.min(length, f + bl - s%bl)

      var l2 = (t - f)
      for (var i = 0; i < l2; i++) {
        buffer[s%bl + i] = data[i + f]
      }

      var ch = (t - f);
      s += ch;
      f += ch

      if(!(s%bl))
        this._update(buffer)
    }
    this._s = s

    return this
  }


  Hash.prototype.digest = function (enc) {
    var bl = this._blockSize
    var fl = this._finalSize
    var len = this._len*8

    var x = this._block

    var bits = len % (bl*8)

    // add end marker, so that appending 0's creates a different hash.
    x[this._len % bl] = 0x80
    x.fill(0, this._len % this._blockSize + 1)

    if (bits >= fl*8) {
      this._update(this._block)
      this._block.fill(0)
    }

    //TODO: handle case where the bit length is > Math.pow(2, 29)
    x.writeInt32BE(len, fl + 4) //big endian

    var hash = this._update(this._block) || this._hash()
    if(enc == null) return hash
    return hash.toString(enc)
  }

  Hash.prototype._update = function () {
    throw new Error('_update must be implemented by subclass')
  }

  return Hash
}
