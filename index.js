'use strict';

const fs = require('fs');
const _ = require('lodash');
const request = require('request');
const cheerio = require('cheerio');

const arbitrarySentenceLength = 3;

/**
 * @class NodeScraping
 *
 * @classdesc NodeScraping Scrapes a list of URLs for a list of tags and returns the text
 */
class NodeScraping {
	/**
	 * Constructor Scrapes a list of URLs for a list of tags and returns the text
	 * @param {object} options - Object instantiation options
	 * @return {array}
	 */
	constructor(options) {
		this.options = Object.assign({}, NodeScraping.DEFAULTS, options || {});
		this.sentences = [];
		return this.run().then(() => {
			return this.sentences;
		});
	}

	run() {
		return new Promise((resolve, reject) => {
			forEachPromise(this.options.urls, this.getUrl.bind(this)).then(() => {
				this.cleanData();
				if (this.options.save) {
					this.writeData(resolve);
				} else {
					resolve();
				}
			});
		});
	}

	/**
	 * Get Data from URLs and push to sentences array
	 * @return {promise}
	 */
	getUrl(url) {
		return new Promise((resolve, reject) => {
			request(url, (error, response, html) => {
				const $ = cheerio.load(html);
				this.options.tags.forEach(tag => {
					$(tag).each((index, elem) => {
						let tagText = $(elem).text();
						let sentencesArray = [tagText];
						if (this.options.shouldSplit) {
							sentencesArray = tagText.split('.');
						}
						sentencesArray.forEach(sentence => {
							this.sentences.push(sentence);
						});
					});
				});
				resolve();
			});
		});
	}

	cleanData() {
		this.sentences.forEach((sentence, index) => {
			// Trim the sentence
			sentence = sentence.trim();
			this.sentences[index] = sentence;
			// If the sentence is just spaces
			if (sentence.replace(/\s/g, '').length === 0) {
				this.sentences[index] = undefined;
			// else if the sentence is very tiny
			} else if (sentence.split(' ').length < arbitrarySentenceLength) {
				this.sentences[index] = undefined;
			}
		});
		this.sentences = _.compact(this.sentences);
	}

	writeData(resolve) {
		fs.writeFile(this.options.save, `module.exports = ${JSON.stringify({sentences: this.sentences})}`, resolve);
	}
}

/**
 *
 * @param items An array of items.
 * @param fn A function that accepts an item from the array and returns a promise.
 * @returns {Promise}
 */
function forEachPromise(items, fn) {
	return items.reduce((promise, item) => {
		return promise.then(() => {
			return fn(item);
		});
	}, Promise.resolve());
}

NodeScraping.DEFAULTS = {
	shouldSplit: false,
	urls: [
		'https://faq.soylent.com/hc/en-us/articles/212831963-How-Soylent-makes-a-difference',
		'https://faq.soylent.com/hc/en-us/articles/212767043-What-is-Soylent-',
		'https://faq.soylent.com/hc/en-us/articles/212769443-Why-Soy-Protein-',
		'https://faq.soylent.com/hc/en-us/articles/212769723-Expiration-and-shelf-life',
		'https://faq.soylent.com/hc/en-us/articles/200332079-Can-I-lose-weight-on-Soylent-',
		'https://faq.soylent.com/hc/en-us/articles/204409635-Preparing-Soylent-Powder-with-the-legacy-measuring-scoop'
	],
	tags: [
		'p',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6'
	],
	save: false
};

module.exports = NodeScraping;
