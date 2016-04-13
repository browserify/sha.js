var test = require('tape').test
var vectors = require('hash-test-vectors')
var shaHash = require('../')

function runTest (alg, i) {
  var vector = vectors[i]
  var input = new Buffer(vector.input, 'base64')

  test(alg + ' NIST vector #' + (i + 1) + ' with .update', function (t) {
    t.same(shaHash(alg).update(input).digest('hex'), vector[alg])
    t.end()
  })

  test(alg + ' NIST vector #' + (i + 1) + ' with streams', function (t) {
    var hash = shaHash(alg)
    hash.end(input)
    t.same(hash.read().toString('hex'), vector[alg])
    t.end()
  })
}

if (process.env.ALGORITHM) {
  if (process.env.VECTOR) {
    runTest(process.env.ALGORITHM, parseInt(process.env.VECTOR, 10) - 1)
  } else {
    for (var j = 0; j < vectors.length; ++j) runTest(process.env.ALGORITHM, j)
  }
} else {
  for (var i = 0; i < vectors.length; ++i) {
    runTest('sha', i)
    runTest('sha1', i)
    runTest('sha224', i)
    runTest('sha256', i)
    runTest('sha384', i)
    runTest('sha512', i)
  }
}
