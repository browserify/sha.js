
//return module.exports = require('buffer').Buffer


var BE = false
var LE = true

module.exports = function (len) {

  var dv = new DataView(new ArrayBuffer(len))

  dv.writeUInt32BE = function (value, i) {
    return dv.setUint32(i, value, BE)
  }
  dv.writeUInt32LE = function (value, i) {
    return dv.setUint32(i, value, LE)
  }
  dv.writeInt32BE = function (value, i) {
    return dv.setInt32(i, value, BE)
  }
  dv.writeInt32LE = function (value, i) {
    return dv.setInt32(i, value, LE)
  }

  dv.readUInt32BE = function (i) {
    return dv.getUint32(i, BE)
  }
  dv.readUInt32LE = function (i) {
    return dv.getUint32(i, LE)
  }

  dv.readInt32BE = function (i) {
    return dv.getInt32(i, BE)
  }
  dv.readInt32LE = function (i) {
    return dv.getInt32(i, LE)
  }

  dv.isBuffer = function (e) {
    return e instanceof DataView && e.writeUInt32BE
  }

  dv.__defineGetter__('length', function () {
    return dv.byteLength
  })

  return dv

}
