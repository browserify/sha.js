

var rotateByteOrder = require('../').rotateByteOrder

var tape = require('tape')

tape('rotate byte order', function (t) {

  var r = rotateByteOrder(0x12345678)
  console.log(r.toString(16))
  t.equal(r, 0x78563412, 'reverse bytes')
  t.equal(rotateByteOrder(r), 0x12345678, 'reverse again')
  t.end()
})

