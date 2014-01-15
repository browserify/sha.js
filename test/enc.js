
var Sha1 = require('../').sha1
var tape = require('tape')
var toString = require('../util').toString
var Buffer = require('native-buffer-browserify').Buffer
var toBuffer = function (b, e) {
  return new Buffer(b, e)
}

var EMPTY = new Uint8Array([
    218,  57, 163, 238,  94, 107,  75,  13,
     50,  85, 191, 239, 149,  96,  24, 144,
    175, 216,   7,   9
  ])

function equalBuffers(a, b, t) {

  if(a.length !== b.length) throw new Error('different lengths')
  for(var i = 0; i < a.length; i++)
    if(a[i] !== b[i])
      t.fail('buffers differ at index:' + i + '(' + a[i] + ' != ' + b[i] + ')')
}


tape('all the output encodings work', function (t) {
  var hex = new Sha1().update('', 'ascii').digest('hex')
  var buffer = new Sha1().update('', 'ascii').digest()
  var base64 = new Sha1().update('', 'ascii').digest('base64')

  t.equal(base64, '2jmj7l5rSw0yVb/vlWAYkK/YBwk=')
  t.equal(hex, 'da39a3ee5e6b4b0d3255bfef95601890afd80709')

  t.notEqual(typeof buffer, 'string')
  console.error('output', typeof buffer)
  equalBuffers(buffer, EMPTY, t)

  t.end()
})

tape('base64', function (t) {
  equalBuffers(toBuffer(toString(EMPTY, 'base64'), 'base64'), EMPTY, t)
  t.end()
})

tape('all input encodings work2', function (t) {
  var hex = new Sha1().update(toString(EMPTY, 'hex'), 'hex').digest('hex')
  var base64 = new Sha1().update(toString(EMPTY, 'base64'), 'base64').digest('hex')
  console.log('Binary:', JSON.stringify(toString(EMPTY, 'binary')))
  var binary = new Sha1().update(toString(EMPTY, 'binary'), 'binary').digest('hex')
  var buffer = new Sha1().update(EMPTY).digest('hex')
  console.log(hex, base64, buffer)
  equalBuffers(hex, base64, t)
  equalBuffers(hex, buffer, t)
  equalBuffers(hex, binary, t)
  t.end()
})

