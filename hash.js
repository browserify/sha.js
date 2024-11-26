'use strict';

var Buffer = require('safe-buffer').Buffer;

var useArrayBuffer = typeof ArrayBuffer !== 'undefined'
  && typeof Uint8Array !== 'undefined'
  && ArrayBuffer.isView;

// prototype class for hash functions
function Hash(blockSize, finalSize) {
	this._block = Buffer.alloc(blockSize);
	this._finalSize = finalSize;
	this._blockSize = blockSize;
	this._len = 0;
}

Hash.prototype.update = function (data, enc) {
	/* eslint no-param-reassign: 0 */
	if (data instanceof Uint8Array) {
		/*
		 * Fast path
		 * Already single-byte wide and 0-255
		 */
	} else if (typeof data === 'string') {
		enc = enc || 'utf8';
		data = Buffer.from(data, enc);
	} else if (useArrayBuffer && ArrayBuffer.isView(data)) {
		// Convert all TypedArray and DataView instances to single-byte-wide Uint8Array views
		var oldSize = data.byteLength;
		data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

		if (!(data.byteLength === oldSize && data.byteLength === data.length)) {
			throw new Error('Unexpected: broken Uint8Array');
		}
	} else {
		if (!data || typeof data !== 'object' || typeof data.length !== 'number') {
			throw new TypeError('Not an array-like');
		}

		// non-negative 32-bit integer
		if ((data.length >>> 0) !== data.length) {
			throw new RangeError('Invalid length');
		}

		for (var j = 0; j < data.length; j++) {
			if ((data[j] & 255) !== data[j]) {
				throw new TypeError('Not a byte array');
			}
		}
	}

	var block = this._block;
	var blockSize = this._blockSize;
	var length = data.length;
	var accum = this._len;

	for (var offset = 0; offset < length;) {
		var assigned = accum % blockSize;
		var remainder = Math.min(length - offset, blockSize - assigned);

		for (var i = 0; i < remainder; i++) {
			block[assigned + i] = data[offset + i];
		}

		accum += remainder;
		offset += remainder;

		if ((accum % blockSize) === 0) {
			this._update(block);
		}
	}

	this._len += length;
	return this;
};

Hash.prototype.digest = function (enc) {
	var rem = this._len % this._blockSize;

	this._block[rem] = 0x80;

	/*
	 * zero (rem + 1) trailing bits, where (rem + 1) is the smallest
	 * non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
	 */
	this._block.fill(0, rem + 1);

	if (rem >= this._finalSize) {
		this._update(this._block);
		this._block.fill(0);
	}

	var bits = this._len * 8;

	// uint32
	if (bits <= 0xffffffff) {
		this._block.writeUInt32BE(bits, this._blockSize - 4);

		// uint64
	} else {
		var lowBits = (bits & 0xffffffff) >>> 0;
		var highBits = (bits - lowBits) / 0x100000000;

		this._block.writeUInt32BE(highBits, this._blockSize - 8);
		this._block.writeUInt32BE(lowBits, this._blockSize - 4);
	}

	this._update(this._block);
	var hash = this._hash();

	return enc ? hash.toString(enc) : hash;
};

Hash.prototype._update = function () {
	throw new Error('_update must be implemented by subclass');
};

module.exports = Hash;
