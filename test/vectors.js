
var vectors = require('./nist-vectors.json')
var Sha1 = require('../')
var tape = require('tape')
var from = require('bops/typedarray/from')
var hexpp = require('../hexpp')

function makeTest(i, verbose) {
  var v = vectors[i]
  tape('NIST vector ' + i, function (t) {
    if(verbose) {
      console.log('VECTOR', i)
      console.log('INPUT', v.input)
      console.log(hexpp(from(v.input, 'base64')))
      console.log(new Buffer(v.input, 'base64').toString('hex'))
    }
    var buf = from(v.input, 'base64')
    t.equal(new Sha1().update(buf).digest('hex'), v.sha1)
    t.end()
  })
  
}

if(process.argv[2])
  makeTest(parseInt(process.argv[2]), true)
else
  vectors.forEach(function (v, i) {
    makeTest(i)
  })



