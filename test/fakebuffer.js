
var RealBuffer = require('buffer').Buffer
var FakeBuffer = require('../fakebuffer')

var length = 12
var rb = new RealBuffer(length)
var fb = new FakeBuffer(length)

for(var i = 0; i < length; i += 4) {
  var r = (Math.random()*0x80000000)|0
  fb.writeUInt32BE(r, i)
  rb.writeUInt32BE(r, i)
}

console.log(fb)
console.log(rb)

var equal = require('assert').equal

for(var i = 0; i < length; i += 4) {
  equal(rb.readUInt32BE(i), fb.readUInt32BE(i))
  equal(rb.readInt32BE(i), fb.readInt32BE(i))
  equal(rb.readUInt32LE(i), fb.readUInt32LE(i))
  equal(rb.readInt32LE(i), fb.readInt32LE(i))
}

for(var i = 0; i < length; i ++) {
  equal(rb[i], fb[i])
}


