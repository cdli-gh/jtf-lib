const nearley = require("nearley");

/*---/ Regex Patterns /-------------------------------------------------------*/
// Regex for extracting error information from Nearley Syntax errors
const RE_PARSER_SYNTAX_ERROR = /Syntax error at line (\d+) col (\d+):\n\n[ ]{2}(.*)\n.+/;
// Regex for extracting error information from Moo lexer errors
const RE_LEXER_SYNTAX_ERROR = /invalid syntax at line (\d+) col (\d+):\n\n[ ]{2}(.+)\n.+/;
const RE_TOKEN_DATA_ERROR = /.*Unexpected ([^ ]+) token: "([^"]+)".*/;


/*---/ Parser /--------------------------------------------------------------*/

const parse = function( parserClass, p_name, data, reference='', ambigLog=true ) {
	// Parse data with new nearly parser instance.
	// Nearly parser shortcut
	let parser = new nearley.Parser(
		nearley.Grammar.fromCompiled(parserClass)
	);
	var warnings = [];
	var errors = [];
	var response = null;
	try {
		parser.feed(data);
		// ambiguity check:
		warnings = checkResponseQuantity(
			parser, p_name, data, warnings, ambigLog)
		if (parser.results[0]){
			response = parser.results[0];
		};
	} catch(e) {
		let err_obj = processError(e, p_name);
		errors.push(err_obj);
		//console.log( 'error catched', errors )
	};
	let response_obj = {
		reference: reference,
		success: response!=null,
		errors: errors,
		warnings: warnings,
		atf: data.replace("␃", ''),
	};
	if (response){
		if (response.errors){
			//console.log('errors in response', response)
			let errors_add = response.errors.map(e => processError(e, p_name))
			response_obj.errors = [...errors, ...errors_add]
		};
		Object.keys(response).forEach( k => {
			if (response[k]){
				response_obj[k] = response[k];
			};
		});
	}
	return response_obj;
};

const checkResponseQuantity = function(
		parser, p_name, data, warnings=[], ambigLog=false ){
	// Get ambiguity  warnings array.
	let resultSet = new Set(parser.results.map( r => JSON.stringify(r)));
	if (resultSet.size>1 && ambigLog ){
		let warning_text = 'ATF '+p_name+' parser WARNING: Ambiguity.\n'+
			resultSet.size+' variants for string.\n';
		warnings.push({
			agent: 'ATF '+p_name,
			type: 'ambiguity',
			text: warning_text,
			variants: resultSet.size,
			data: Array.from(resultSet),
		});
	} else if (resultSet.size===0){
		let warning_text = 'ATF '+p_name+' Parser WARNING: Empty response.';
		warnings.push({
			agent: 'ATF '+p_name,
			type: 'empty',
			text: warning_text,
			variants: 0,
		});
	};
	return warnings;
};

/*---/ Error processing /---------------------------------------------------*/

const processError = function( error, p_name ){
	// Parse error message.
	//console.log('ATF '+p_name+' Parser ERROR:');
	//console.log(error);
	if ( error.agent ) {
		// already processed
		return error;
	};
	let { message } = error;
        if (message.match(RE_PARSER_SYNTAX_ERROR)){
		return nearlyError2Object(message, p_name);
	} else if (message.match(RE_LEXER_SYNTAX_ERROR)){
		let match = message.match(RE_LEXER_SYNTAX_ERROR);
		let err_obj = {
			agent: 'ATF '+p_name,
			type: 'syntax',
			line: parseInt(match[1]),
			column: parseInt(match[2]),
			string: match[3],
		};
		return err_obj;
	} else { 
		//console.log('unhandled error:', error);
		return error;
	};
};

const nearlyError2Object = function(error, p_name){
	//
	let [keys, trees, err_lines] = nearlyErrorAnalyze(error);
        // Will match if the error is a lexer (Moo)
        // error.
        // Otherwise, match on a Nearley error using
        // alternate regex.
        let match = error.match(RE_PARSER_SYNTAX_ERROR);
	let matchToken = error.match(RE_TOKEN_DATA_ERROR);
        console.log('!!!!!!!!', error, match);
	let err_obj = {
		text: error,
		agent: 'ATF '+p_name,
		type: 'syntax',
		line: parseInt(match[1]),
		column: parseInt(match[2]),
		string: match[3],
		tokenValue: (matchToken) ? matchToken[2] : null,
		tokenClass: (matchToken) ? matchToken[1] : null,
		nearlyHints: nearlyErrorAsTree(keys, trees, err_lines),
	};
	err_obj.parser = 'ATF '+p_name;
	return err_obj;
};

const nearlyErrorAnalyze = function(error){
	//
	let err_lines = error.split('see one of the following:\n\n')[1]
		.split('\n\n    at Parser.feed')[0].split('\n')
		.filter(function (el) {
			return el!='';
	});
	let keys = [];
	let trees = [];
	err_lines.forEach(function(el, i){
		if (el.includes('token based on')) {
			keys.push(i)
		} else if (el.includes('    ')) {
			trees.push(i)
		};
	});
	return [keys, trees, err_lines];
};

const nearlyErrorAsTree = function(keys, trees, err_lines){
	//
	let err_obj = {};
	keys.push(err_lines.length);
	trees.forEach(function(tre){
		for(var i=0; i < keys.length-1; i++){
			if (tre > keys[i] && tre < keys[i+1]){
				err_obj = addKey(keys[i], tre, err_lines, err_obj)
			};
		};
	});
	return err_obj;
};

const addKey = function(key, tre, err_lines, err_obj){
	//
	tre = err_lines[tre].replace('    ', '');
	var token = err_lines[key].split(' ')[1];
	if (err_obj.hasOwnProperty(key)){
		err_obj[key].tree.push(tre);
	} else {
		err_obj[key] = {token: token, tree: [tre]};
	};
	return err_obj;
};

module.exports = { 
	parse,
};
