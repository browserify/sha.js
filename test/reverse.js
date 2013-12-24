

var reverseByteOrder = require('../').reverseByteOrder
var Uint32toHex = require('../').Uint32toHex

var tape = require('tape')

tape('rotate byte order', function (t) {
  var r = reverseByteOrder(0x12345678)
  console.log(Uint32toHex(r))
  t.equal(r, 0x78563412, 'reverse bytes')
  t.equal(reverseByteOrder(r), 0x12345678, 'reverse again')
  t.end()
})

function reverse(a, b, t) {

  t.equal(reverseByteOrder(a)|0, b|0)
  console.log(Uint32toHex(reverseByteOrder(a)), Uint32toHex(b))
  t.equal(reverseByteOrder(b)|0, a|0)
  console.log(Uint32toHex(reverseByteOrder(b)), Uint32toHex(a))
}

tape('rotate byte order, da39a3ee', function (t) {
  reverse(0xeea339da, 0xda39a3ee, t)
  reverse(0xee0039da, 0xda3900ee, t)
  reverse(0xee0000da, 0xda0000ee, t)
  reverse(0x00a33900, 0x0039a300, t)

  t.end()
})
