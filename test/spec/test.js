'use strict';

const chai = require('chai');
const NodeScraperToText = require('./../../');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

describe('NodeScraperToText', function () {
	it('should be a function', function () {
		assert.equal('function', typeof NodeScraperToText);
	});
});
