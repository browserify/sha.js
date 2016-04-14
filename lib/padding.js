'use strict'
exports.block64 = function () {
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 56) {
    this._block.fill(0, this._blockOffset, 64)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 56)
  this._block.writeUInt32BE(this._length[1], 56)
  this._block.writeUInt32BE(this._length[0], 60)
  this._update()
}

exports.block128 = function () {
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 112) {
    this._block.fill(0, this._blockOffset, 128)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 112)
  this._block.writeUInt32BE(this._length[3], 112)
  this._block.writeUInt32BE(this._length[2], 116)
  this._block.writeUInt32BE(this._length[1], 120)
  this._block.writeUInt32BE(this._length[0], 124)
  this._update()
}
