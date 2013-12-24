
var crypto = require('crypto')
var tape   = require('tape')
var Sha1   = require('../')
var Uint32toHex = Sha1.Uint32toHex

function generateCount (m) {
  var s = ''
  for(var i = 0; i < m/8; i++) {
    console.log('GENERATE', i, Uint32toHex(i))
    s+=i
  }
  return s
}

var inputs = [
 ['', 'ascii'],
 ['abc', 'ascii'],
 ['123', 'ascii'],
 ['123456789abcdef123456789abcdef123456789abcdef123456789abcdef', 'ascii'],
 ['123456789abcdef123456789abcdef123456789abcdef123456789abc', 'ascii'],
 ['123456789abcdef123456789abcdef123456789abcdef123456789ab', 'ascii'],
 ['0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde', 'ascii'],
 ['0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'ascii']
]

tape("hash is the same as node's crypto", function (t) {

  inputs.forEach(function (v) {
    console.log('HASH', v, v[0].length)
    var a = new Sha1().update(v[0], v[1]).digest('hex')
    var e = crypto.createHash('sha1').update(v[0], v[1]).digest('hex')
    console.log(a, e)
    t.equal(a, e)
  })

  t.end()

})
