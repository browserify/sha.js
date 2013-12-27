
var Hash = require('../hash')
var hexpp = require('../hexpp').defaults({bigendian: false})
var u = require('../util')
var tape = require('tape')

var hex = '0A1B2C3D4E5F6G7H', hexbuf
function equal(t, a,b) {
  t.equal(a.length, b.length)
  for(var i = 0; i < a.length; i++)
    t.equal(a[i], b[i])
}

var count16 = {
      strings: ['0A1B2C3D4E5F6G7H'],
      buffers: [
        hexbuf = new Uint8Array([
          48, 65, 49, 66,   50, 67, 51, 68,
          52, 69, 53, 70,   54, 71, 55, 72
        ]),
        new Uint8Array([
         128,  0,  0,  0,    0,  0,  0,  0,
           0,  0,  0,  0,    0,  0,  0, 128
        ])
      ]
    }
var empty = {
      strings: [''],
      buffers: [
        new Uint8Array([
         128,  0,  0,  0,    0,  0,  0,  0,
           0,  0,  0,  0,    0,  0,  0,  0
        ])
      ]
    }
var hh = 'abcdefhijklmnopq'

var multi = {
      strings: ['abcd', 'efhijk', 'lmnopq'],
      buffers: [
        toBuffer('abcdefhijklmnopq', 'ascii'),
        new Uint8Array([
         128,  0,  0,  0,    0,  0,  0,  0,
           0,  0,  0,  0,    0,  0,  0,  128
        ])
      ]
    }

var long = {
      strings: [hex+hex],
      buffers: [
        hexbuf,
        hexbuf,
        new Uint8Array([
         128,  0,  0,  0,    0,  0,  0,  0,
           0,  0,  0,  0,    0,  0,  1,  0
        ])
      ]
    }


function toBuffer (string, enc) {
  var a = new Uint8Array(string.length)
  u.write(a, string, enc, 0, 0, string.length, true)
  return a
}

function makeTest(name, data) {
  tape(name, function (t) {

    var h = new Hash(16, 8)
    var hash = new Uint8Array(20)
    var n = 2
    var expected = data.buffers.slice()
    //t.plan(expected.length + 1)
    h._update = function (block) {
      var e = expected.shift()
      equal(t, block, e.buffer)
      if(n < 0)
        throw new Error('expecting only 2 calls to _update')

      return hash
    }

    data.strings.forEach(function (string) {
      h.update(string, 'ascii')
    })

    equal(t, h.digest(), hash)
    t.end()

  })
}

makeTest('Hash#update 1 in 1', count16)
makeTest('empty Hash#update', empty)
makeTest('Hash#update 1 in 3', multi)
makeTest('Hash#update 2 in 1', long)

