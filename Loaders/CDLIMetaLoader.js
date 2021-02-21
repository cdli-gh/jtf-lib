'use strict';

/*---/ imports /------------------------------------------------------------*/
const getHTML = require('./getHTMLData.js').getHTML;

/*---/ globals /------------------------------------------------------------*/
const ARCH_URL = 'https://cdli.ucla.edu/search/archival_view.php?ObjectID=P';
const CAT_URL = 'https://cdli.ucla.edu/search/search_results.php?ObjectID=P';

const importMeta = async function ( P_Number ) {
	//
	P_Number = P_Number.replace('P', '')
	var url = encodeURI(ARCH_URL+P_Number);
	var imgs = await getImages( P_Number );
	return await getHTML( url )
		.then(htmlObj => {
			var meta = getMeta( htmlObj );
			meta.images = imgs;
			return meta;
		})
};

const getMeta = function ( htmlObj ) {
	//
	var meta = {};
	htmlObj.querySelectorAll('td table').forEach(table => {
		var section = str2key(table.querySelectorAll('th')[0].rawText);
		meta[section] = {};
		table.querySelectorAll('tr').forEach(row => {
			if (row.querySelectorAll('td').length===2){
				var [txt, value] = row.querySelectorAll('td')
					.map( x => { return x.rawText })
				var key = str2key(txt);
				value = value.replace(/\r|\n/g, '');
				value = value.replace(/^[ ]*|[ ]*$/g, '');
				value = value.replace(/[ ]{2,}/g, ' ');
				if (['secondary_publications', 'citation'].includes(key)){
					value = value.split('; ');
				} else if (key==='measurements_mm') {
					 value = value.split(' x ');
				};
				meta[section][key] = value;
			};
		});
	});
	return meta;
};

const getImages = async function( P_Number ) {
	//
	var url = encodeURI(CAT_URL+P_Number);
	return await getHTML( url ).then(htmlObj => {
		var imgArr = htmlObj.querySelectorAll('td a')
			.map(x => {return x.attributes.href})
			.filter(x => x)
			.filter(x => x.includes('/dl/') || x.includes('rti/rti'))
		return imgArr;
	});
};

const str2key = function( str ) {
	//
	return str
		.replace(/[\:|\(|\)|\.]/g, '')
		.replace(/ /g, '_')
		.toLowerCase();
};

module.exports.importMeta = importMeta;

