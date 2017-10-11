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
	 * @param {object} [options] Object instantiation options
	 * @param {Boolean} [options.shouldSplit=false] Should the chunks of text be split by periods
	 * @param {Array} [options.urls=[list of soylent URLs]] A list of URLs to scrape for text
	 * @param {Array} [options.tags=['p', 'h1', 'h2', ...etc]] A list of tags to scrape from the URLs
	 * @param {Boolean | String} [options.save=false] An optional string for where to save the output result. This will save it as a file with the structure `module.exports = {"sentences": [{your scraped text}]}` so you can import it elsewhere, if that's what you want to do
	 * @return {array}
	 */
	constructor(options) {
		this.options = Object.assign({}, NodeScraping.DEFAULTS, options || {});
		this.sentences = [];
		return this.run().then(() => {
			return this.sentences;
		});
	}

	/**
	 * Runs the scraper
	 * @return {promise}
	 */
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

	/**
	 * Cleans the data, gets rid of excess whitespace,
	 * deletes sentences if they're just whitespace,
	 * or if they fall under the arbitrary 3 character minimum
	 * @return {promise}
	 */
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

	/**
	 * Write the data to a file, if you want to
	 * @param  {promise} [resolve] The resolution of the promise of the `run` function
	 * @return {promise}
	 */
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
