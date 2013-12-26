
var Hash = require('../hash')
var hexpp = require('../hexpp').defaults({bigendian: true})
var tape = require('tape')
var hex = '0A1B2C3D4E5F6G7H'

var u = require('../util')

function toBuffers (string, length) {
  var a = []
  for(var i = 0; i < string.length / length; i ++) {
    a[i] = new Uint8Array(length)
    u.write(a[i], string, 'ascii', 0, i*length, Math.min((i+1)*length, string.length))
  }
  return a
}

tape('Hash#update 1 in 1 messages', function (t) {

  var h = new Hash(16, 12)
  var n = 1
  t.plan(2)
  h._update = function (block) {
    console.log('---WRITTEN---')
    console.log(hexpp(this._block))
    t.deepEqual(block, toBuffers(hex, 16)[0].buffer)
    if(n < 0)
      throw new Error('expecting only 2 calls to _update')
  }

  h._final = function (block) {
    t.equal(--n, 0)
    console.log('final', block)
    return new Uint8Array(20)
  }

  h.update(hex)
  h.digest()
  t.end()

})

tape('Hash#update 2 in 1 messages', function (t) {

  var h = new Hash(16, 12)
  var n = 3
  t.plan(3)
  h._update = function (block) {
    console.log('---WRITTEN---')
    console.log(hexpp(this._block))
    t.ok(--n)
    if(n < 0)
      throw new Error('expecting only 2 calls to _update')
  }

  h._final = function (block) {
    t.equal(--n, 0)
    console.log('final', block)
    return new Uint8Array(20)
  }

  h.update(hex+hex)
  var hash = h.digest()
  console.log(hash)

  t.end()
})

tape('Hash#update 1 in 3 messages', function (t) {

  var h = new Hash(16)
  var n = 2
  t.plan(3)
  var hh = hex+hex
  var hh = 'abcdefhijklmnopq'
  var expected = toBuffers(hh, 16)
  console.log('expected')
  h._update = function (block) {
    console.log('---WRITTEN---')
    console.log(hexpp(this._block))
    t.deepEqual(block, expected.shift().buffer)
    t.ok(--n)
    if(n < 0)
      throw new Error('expecting only 2 calls to _update')
  }

  h._final = function (block) {
    t.equal(--n, 0)
    console.log('final', block)
    return new Uint8Array(20)
  }

  h.update(hh.substring(0, 4)).update(hh.substring(4, 10)).update(hh.substring(10, 16))
  var hash = h.digest()
  console.log(hash)

  t.end()
})

