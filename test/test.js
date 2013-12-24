
var crypto = require('crypto')
var tape   = require('tape')
var Sha1   = require('../')

var inputs = [
 ['', 'ascii'],
// ['abc', 'ascii'],
// ['123', 'ascii']
]

tape("hash is the same as node's crypto", function (t) {

  inputs.forEach(function (v) {
    var a = new Sha1().update(v[0], v[1]).digest('hex')
    var e = crypto.createHash('sha1').update(v[0], v[1]).digest('hex')
    t.equal(a, e)
  })

  t.end()

})
