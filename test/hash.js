
var Hash = require('../hash')

var tape = require('tape')

tape('Hash#update 2 in 1 messages', function (t) {

  var h = new Hash(16)
  var n = 3
  t.plan(3)
  h._update = function (block) {
    console.log(block)
    t.ok(--n)
    if(n < 0)
      throw new Error('expecting only 2 calls to _update')
  }

  h._final = function (block) {
    t.equal(--n, 0)
    console.log('final', block)
    return new Uint8Array(20)
  }

  h.update('0123456789abcdef0123456789abcdef')
  var hash = h.digest()
  console.log(hash)

  t.end()
})

tape('Hash#update 2 in 3 messages', function (t) {

  var h = new Hash(16)
  var n = 3
  t.plan(3)
  h._update = function (block) {
    console.log(block)
    t.ok(--n)
    if(n < 0)
      throw new Error('expecting only 2 calls to _update')
  }

  h._final = function (block) {
    t.equal(--n, 0)
    console.log('final', block)
    return new Uint8Array(20)
  }

  h.update('0123').update('456789abc').update('def0123456789abcdef')
  var hash = h.digest()
  console.log(hash)

  t.end()
})

