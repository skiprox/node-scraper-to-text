'use strict';

/**
 * @class NodeScraperToText
 *
 * @classdesc NodeScraperToText description
 */
class NodeScraperToText {
	/**
	 * Constructor description
	 * @param {object} options - Object instantiation options
	 * @return {null}
	 */
	constructor(options) {

		this.options = Object.assign({},
			NodeScraperToText.DEFAULTS, options || {});
	}

	/**
	 * Method description
	 * @return {null}
	 */
	public() {
	}

	/**
	 * Private method description
	 * @private
	 * @return {null}
	 */
	private() {
	}
}

NodeScraperToText.DEFAULTS = {};

module.exports = NodeScraperToText;
