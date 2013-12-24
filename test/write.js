
var tape = require('tape')
var write = require('../').write

tape('supports bigendian', function (t) {

  var actual = new Uint8Array(12)

  var expected = new Uint8Array([108, 108, 101, 104, 104, 116, 32, 111, 46, 101, 114, 101])

  write(actual, 'hello there.', 'ascii', 0, 0, 12)

  console.log(actual.buffer)
  console.log(expected.buffer)

  t.deepEqual(expected, actual)
  t.end()
})
