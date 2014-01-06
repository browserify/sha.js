var Sha1 = require('../sha1')
var tape = require('tape')
var toString = require('../util').toString
var toBuffer = require('bops/typedarray/from')

var EMPTY = new Uint8Array([
    218,  57, 163, 238,  94, 107,  75,  13,
     50,  85, 191, 239, 149,  96,  24, 144,
    175, 216,   7,   9
  ])

tape('all the output encodings work', function (t) {
  var hex = new Sha1().update('', 'ascii').digest('hex')
  var buffer = new Sha1().update('', 'ascii').digest()
  var base64 = new Sha1().update('', 'ascii').digest('base64')
  t.equal(base64, '2jmj7l5rSw0yVb/vlWAYkK/YBwk=')
  t.equal(hex, 'da39a3ee5e6b4b0d3255bfef95601890afd80709')
  t.deepEqual(buffer, EMPTY)
  t.end()
})

tape('base64', function (t) {
  t.deepEqual(toBuffer(toString(EMPTY, 'base64'), 'base64'), EMPTY)
  t.end()
})

tape('all input encodings work', function (t) {
  var hex = new Sha1().update(toString(EMPTY, 'hex'), 'hex').digest('hex')
  var base64 = new Sha1().update(toString(EMPTY, 'base64'), 'base64').digest('hex')
  console.log('Binary:', JSON.stringify(toString(EMPTY, 'binary')))
  var binary = new Sha1().update(toString(EMPTY, 'binary'), 'binary').digest('hex')
  var buffer = new Sha1().update(EMPTY).digest('hex')
  console.log(hex, base64, buffer)
  t.equal(hex, base64)
  t.equal(hex, buffer)
  t.equal(hex, binary)
  t.end()
})

