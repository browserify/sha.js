
var tape = require('tape')
var write = require('../util').write
var hexpp = require('../hexpp')

tape('supports bigendian', function (t) {

  var actual = new Uint8Array(12)

  var expected = new Uint8Array([108, 108, 101, 104, 104, 116, 32, 111, 46, 101, 114, 101])

  write(actual, 'hello there.', 'ascii', 0, 0, 12)

  console.log(hexpp(actual.buffer))
  console.log(hexpp(expected.buffer))

  t.deepEqual(expected, actual)
  t.end()
})

tape('several writes', function (t) {
  var actual = new Uint8Array(9)
  write(actual, 'foo', 'ascii', 0, 0, 3)
  write(actual, 'bar', 'ascii', 3, 0, 3)
  write(actual, 'baz', 'ascii', 6, 0, 3)
  var expected = new Uint8Array([0,0,0, 0,0,0, 0,0,0])
  console.log(hexpp(actual.buffer, {bigendian: true}))
//  console.log(hexpp(expected.buffer))
  //t.deepEqual(expected, actual)
  t.end()
})
