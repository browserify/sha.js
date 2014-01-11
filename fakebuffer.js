
//return module.exports = require('buffer').Buffer

module.exports = function (len) {

  var dv = new DataView(new ArrayBuffer(len))

  dv.writeUInt32BE = function (value, i) {
    return dv.setUint32(i, value, false)
  }
  dv.writeUInt32LE = function (value, i) {
    return dv.setUint32(i, value, true)
  }

  dv.readUInt32BE = function (value, i) {
    return dv.getUint32(i, false)
  }
  dv.readUInt32LE = function (value, i) {
    return dv.getUint32(i, true)
  }

  dv.writeInt32BE = function (value, i) {
    return dv.setInt32(i, value, false)
  }
  dv.writeInt32LE = function (value, i) {
    return dv.setInt32(i, value, true)
  }

  dv.readInt32BE = function (value, i) {
    return dv.getInt32(i, false)
  }
  dv.readInt32LE = function (value, i) {
    return dv.getInt32(i, true)
  }

  dv.isBuffer = function (e) {
    return e instanceof DataView && e.writeUInt32BE
  }

  return dv

}
