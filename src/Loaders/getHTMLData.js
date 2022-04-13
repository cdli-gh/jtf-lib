'use strict';

// ? Unused ?
// Clean-up:
// * Remove `node-html-parser` if not used elsewere.

/*---/ imports /------------------------------------------------------------*/
const fetch = require('node-fetch');
const parseHTML = require('node-html-parser').parse;

const getHTML = async function( url ){
	// Get the HTML source.
	// Return `node-html-parser` object.
	const response = await fetch(url);
	const result = await response.text();
	return parseHTML(result);
};

module.exports.getHTML = getHTML;
