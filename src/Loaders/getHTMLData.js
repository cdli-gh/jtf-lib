'use strict';

// ? Unused ?
// Clean-up:
// * Remove `request`, `request-promise`, `node-html-parser`
//   if not used elsewere.

/*---/ imports /------------------------------------------------------------*/
const request = require('request');
const rp = require('request-promise');
const parseHTML = require('node-html-parser').parse;

const getHTML = async function( url ){
	// Get the HTML source.
	// Return `node-html-parser` object.
	const result = await rp(url);
	await new Promise (resolve => {
		setTimeout(resolve, 240000);
	});
	return parseHTML(result);
};

module.exports.getHTML = getHTML;