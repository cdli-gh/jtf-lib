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
const ATFTextP = require('../ATFParser/ATFInline/ATFtextGrammar.js');
const JTFFormatter = require('../Formatter/JTFFormatter.js').JTFFormatter;

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

/*---/ Converters /----------------------------------------------------------*/

const ATF2JTF = function( atfStr, reference='', ambigLog=false ){
	// Convert complete single ATF string to JTF.
	// Prepare string:
	atfStr = preprocessATFString(atfStr);
	// Parse ATF to get structure:
	var call = parse(ATFStructureP, 'structure', atfStr, reference, ambigLog);
	//console.log('call !', call)
	if (!call.success){
		return call;
	};
	return JTFFormatter(call);
};

const ATFLine2JTF = function( atfLineStr, reference='', ambigLog=false ){
	// Convert ATF line string to JTF Line.
	let JTF_raw = line2JTF({children: atfLineStr,}, reference, true);
	//var call = parse(ATFTextP, 'structure', atfLineStr, reference, ambigLog);
	//call.JTF = JTFFormatter(JTF_raw);
	return JTFFormatter(JTF_raw);
};

const ATFChar2JTF = function( atfChrStr, reference='' ){
	// Convert ATF char string to JTF chr.
	let JTF_raw = line2JTF({children: atfChrStr,}, reference, true);
	call.JTF = JTFFormatter(JTF_raw).children[0].children[0];
	return call;
};


/*---/ (Post)proccessors /--------------------------------------------------*/

/*---/ JTF Inline /----*/

const line2JTF = function( line, reference='', getResponse=false ) {
	// Convert line to UqNU Line dict.
	line._class = 'line';
	if (typeof line.children==='string'){
		let [call, newLine] = parseInline(line, reference, getResponse);
		if ( !newLine || getResponse ){ return call }
		line = newLine;
	};
	return inlineFieldMaker( line );
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

/*---/ Command line: ATF to JTF from file /----*/

makeJTF = function( sourceType, ...args ){
	// Make JTF & save to target.
	
};

fromCDLI = function( PNumber, target ){
	// Make JTF & save to target.
	// Fetch ATF from CDLI by PNumber.
	
};

fromATF = function( source, target ){
	// Make JTF & save to target.
	// From ATF file.
	
};

/*---/ Exports /------------------------------------------------------------*/

exports.ATF2JTF = ATF2JTF;
exports.ATFLine2JTF = ATFLine2JTF;
exports.ATFChar2JTF = ATFChar2JTF;