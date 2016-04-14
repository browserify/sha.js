# sha.js

[![NPM Package](https://img.shields.io/npm/v/sha.js.svg?style=flat-square)](https://www.npmjs.org/package/sha.js)
[![Build Status](https://img.shields.io/travis/crypto-browserify/sha.js.svg?branch=master&style=flat-square)](https://travis-ci.org/crypto-browserify/sha.js)
[![Dependency status](https://img.shields.io/david/crypto-browserify/sha.js.svg?style=flat-square)](https://david-dm.org/crypto-browserify/sha.js#info=dependencies)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Node style `SHA` on pure JavaScript.

## Example

```js
var shajs = require('sha.js')

console.log(shajs('sha256').update('42').digest('hex'))
// => 73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049
console.log(new shajs.SHA256().update('42').digest('hex'))
// => 73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049

var sha256stream = shajs('sha256')
sha256stream.end('42')
console.log(sha256stream.read().toString('hex'))
// => 73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049
```

## supported hashes

`sha.js` currently implements:

  - SHA (SHA-0) -- **legacy, do not use in new systems**
  - SHA-1 -- **legacy, do not use in new systems**
  - SHA-224
  - SHA-256
  - SHA-384
  - SHA-512

## License

MIT
