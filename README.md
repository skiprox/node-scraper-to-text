# Node Scraper to Text
> Scrape a bunch of URLs for tags, get an array of strings back

This is to be run server side, not client side. Do it to pull down some fun text from websites, to use in twitter bots or wherever.

## Installation
Install via npm:

```sh
$ npm i node-scraper-to-text --save
```

## Usage
As a module:

```js
const NodeScraperToText = require('node-scraper-to-text');
const options = {};
const nodeScraperToText = new NodeScraperToText(options);
```

You can pass in some actual options, too :)

```js
const NodeScraperToText = require('node-scraper-to-text');
const options = {
	shouldSplit: true,
	urls: ['https://reddit.com'],
	tags: ['a.title']
};
const nodeScraperToText = new NodeScraperToText(options);
```

## Options

Instantiation options.

* `@param {boolean} shouldSplit` - Whether to split the text by periods or not.
* `@param {array} urls` - An array of URL strings
* `@param {array} tags` - An array of tag strings (jQuery type strings, they will be searched like `$(tag)`)
* `@param {Boolean | String} save` - Whether to save the file (pass a location for the file if you want it to save, e.g. "./my-dumb-file.js"). Will save the file as `module.exports = {"sentences": [... your scraped sentences array]}`

## Issues

If you notice anything wrong, or want me to add something, feel free to file an issue [here](https://github.com/skiprox/node-scraper-to-text/issues).
