/*---/ ATF2JTF /------------------------------------------------------------*/

// * Parse ATF structure & lines. 
// * Perform some data adjustments & clean-ups to get proper JTF.

// response is to be clean JTF that mirrors UqNU's component trees
// and corresponding attributes.

// ToDo: For clearer structure, This better to be merged with
// the parser's postprocessors.

/*---/ Imports /------------------------------------------------------------*/

/* Use compiled nearly grammar */
const { parse } = require('../ATFParser/parserTools.js');
const ATFStructureP = require("../ATFParser/ATFStructure/ATFgrammar.js");
const { structureParseState, resetStructureParseState, uniqueMessages } = require("../ATFParser/ATFStructure/ATFStructureParseState.js");
const ATFTextP = require('../ATFParser/ATFInline/ATFtextGrammar.js');
const { JTFFormatter } = require('../Formatter/JTFFormatter.js');

/*---/ ATF string preprocessor /---------------------------------------------*/

const preprocessATFString = function( string ){
	// Prepare string for parsing.
	// Replace line end variations with standard.
	string = string.replace(/[ ]*(\r\n|\n|\r)/gm,'\n');
	string = string.replace(/[ ]*\n/gm,'\n');
	string = string.replace(/\n+/gm,'\n');
	if (string.slice(-1)==='\n'){
		string = string.slice(0, -1);
	};
	return string+'\n␃';
};

const textLineNumbersOfParsedLines = function( string ){
	// Line number in the text received for each line of the prepared string.
	let textLines = string.replace(/[ ]*(\r\n|\n|\r)/gm,'\n').split('\n');
	let textLineNumbers = [];
	textLines.forEach( ( line, index ) => {
		if ( line!=='' || index===0 ){
			textLineNumbers.push( index+1 );
		};
	});
	return [textLineNumbers, textLines.length];
};

const withTextLineNumbers = function( messages, textLineNumbers, textLineCount ){
	return (messages || []).map( message => {
		if ( Number.isInteger(message.line) && message.line>0 ){
			let textLineNumber = textLineNumbers[message.line-1];
			message.line = (textLineNumber) ? textLineNumber : textLineCount;
		};
		return message;
	});
};

/*---/ Converters /----------------------------------------------------------*/

const ATF2JTF = function( atfStr, reference='', ambigLog=false, languageSwitchCodes=null ){
	// Convert complete single ATF string to JTF.
	let [textLineNumbers, textLineCount] = textLineNumbersOfParsedLines(atfStr);
	// Prepare string:
	atfStr = preprocessATFString(atfStr);
	resetStructureParseState(languageSwitchCodes);
	// Parse ATF to get structure:
	var call = parse(ATFStructureP, 'structure', atfStr, reference, ambigLog);
	//console.log('call !', call)
	if (!call.success){
		call.errors = [...uniqueMessages(structureParseState.errors), ...call.errors];
	};
	resetStructureParseState();
	call.errors = withTextLineNumbers(call.errors, textLineNumbers, textLineCount);
	call.warnings = withTextLineNumbers(call.warnings, textLineNumbers, textLineCount);
	if (!call.success){
		return call;
	};
	return JTFFormatter(call);
};

const ATFLine2JTF = function( atfLineStr, reference='', ambigLog=false ){
	// Convert ATF line string to JTF Line.
	let [call, JTF_raw] = parseInline({children: atfLineStr,}, reference, true);
	if (!call.success){
		return call;
	};
	return JTFFormatter(call);
};

const ATFChar2JTF = function( atfChrStr, reference='' ){
	// Convert ATF char string to JTF chr.
	let [call, JTF_raw] = parseInline({children: atfLineStr,}, reference, true);
	if (!call.success){
		return call;
	};
	call.inline = [call.inline.children[0].children[0]]
	return JTFFormatter(call);
};

/*---/ ATF inline parser /----*/

const parseInline = function(line, reference=''){
	// Parse line string.
	line.children+=' \n' //important!
	var call = parse(ATFTextP, 'inline', line.children );
	call.reference = reference;
	line.children = call.response;
	if ( !call.success ){
		if (!call.success){
			call.errors[0].line = line.toLine;
		};
		return [call, null];
	};
	return [call, line];
};

/*---/ Exports /------------------------------------------------------------*/

exports.ATF2JTF = ATF2JTF;
exports.ATFLine2JTF = ATFLine2JTF;
exports.ATFChar2JTF = ATFChar2JTF;