/*---/ State of one structure parse /-----------------------------------------*/

const structureParseState = {
	meta: {},
	errors: [],
	warnings: [],
	languageSwitchCodes: null,
};

const resetStructureParseState = function( languageSwitchCodes=null ){
	structureParseState.meta = {};
	structureParseState.errors = [];
	structureParseState.warnings = [];
	structureParseState.languageSwitchCodes = ( Array.isArray(languageSwitchCodes) )
		? new Set( languageSwitchCodes.map( code => String(code).trim().toLowerCase() ).filter( code => code!=='' ) )
		: null;
};

const uniqueMessages = function( messages ){
	let seen = new Set();
	return messages.filter( message => {
		let key = JSON.stringify(message);
		if (seen.has(key)) { return false };
		seen.add(key);
		return true;
	});
};

/*---/ Language switch codes /-----------------------------------------------*/

const patternOfALanguageSwitch = /(^|[ \[{<(_])%([a-z][a-z\d]*(?:-[a-z\d]+)*)(?:\/[a-z]+)?(?= |$)/g;

const patternOfAnInlineComment = /\(\$.*?\$\)/g;

const messagesOfTheUnknownLanguageSwitchCodes = function( inlineStr, toLine, columnOfTheFirstCharacter ){
	let knownCodes = structureParseState.languageSwitchCodes;
	if ( knownCodes===null ){ return [] };
	let inlineStrWithoutComments = inlineStr.replace( patternOfAnInlineComment, comment => ' '.repeat(comment.length) );
	let messages = [];
	for ( let languageSwitch of inlineStrWithoutComments.matchAll(patternOfALanguageSwitch) ){
		let code = languageSwitch[2];
		if ( knownCodes.has(code) ){ continue };
		messages.push({
			agent: 'ATF language switch',
			type: 'unknownLanguageCode',
			code: code,
			line: toLine,
			column: columnOfTheFirstCharacter + languageSwitch.index + languageSwitch[1].length,
			message: 'The language code %'+code+' is not in the list of languages.',
		});
	};
	return messages;
};

module.exports = {
	structureParseState,
	resetStructureParseState,
	uniqueMessages,
	messagesOfTheUnknownLanguageSwitchCodes,
};
