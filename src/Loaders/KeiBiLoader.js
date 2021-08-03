'use strict';

/*---/ imports /------------------------------------------------------------*/
const getHTML = require('./getHTMLData.js').getHTML;

/*---/ globals /------------------------------------------------------------*/
const VOL_URL = 
	'https://vergil.uni-tuebingen.de/keibi/index.php?r=citation/list&volume='
	
const BIBTEX_URL = 
	'https://vergil.uni-tuebingen.de/keibi/index.php?r=bibtex/get&id={{ID}}&type=bibtex'

const importKeiBi = function( ){
	//
	var volumes = [...Array(75).keys()].map(i => i+1);
	volumes.forEach(vol => {
		importVolume( vol );
	});
};

const importVolume = async function( vol ){
	//
	var url = VOL_URL+vol
	await getHTML( url )
		.then( htmlObj => {
			console.log(url);
			var citations = htmlObj.querySelectorAll(
					'#citations-add-to-basket div.citation'
				).map(
					citHTMLObj => {return makeCitiaiton(citHTMLObj)}
				);
			console.log(citations);
		})
		.catch(console.errors);
}; 

const makeCitiaiton = function( citHTMLObj ){
	//
	var id = citHTMLObj.querySelectorAll('.a[name]')[0]
		if (!id){return null};
		id = id.attributes.name;
	var id_num = citHTMLObj.querySelectorAll('input')[0]
		if (!id_num){return null};
		id_num = id_num.attributes.value;
	var references = citHTMLObj.querySelectorAll('.a[class="keibiref" rel]')
		.map( obj => {return obj.rawText });
	return getHTML( BIBTEX_URL.replace('{{ID}}', id_num) )
		.then(
			bibtex => {
			var citObj = {
				id: id,
				id_num: id_num,
				references: references,
				bibtex: bibtex,
			};
			console.log(citObj);
			return citObj;
		}).catch(console.errors);
};

module.exports.importKeiBi = importKeiBi;