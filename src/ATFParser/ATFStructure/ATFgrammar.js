// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
 
	const lexer = require('./ATFTokenizer.js').lexer;


const flatAll = function( array ) {
	if (array && !Array.isArray( array )) {
		return [array];
	} else if (!array) {
		return [];
	};
	var new_array = [];
	array.forEach( function( x, i ){
		if ( Array.isArray( x ) ) {
			x = flatAll( x );
			if (x) {
				new_array = new_array.concat( x );
			};
		} else if (x) { //this filters out null etc.
			new_array.push( x )
		};
	}, array);
	return new_array
};


const ATFTextP = require('../ATFInline/ATFtextGrammar.js');
const { parse } = require('../parserTools.js');

// Define globals here:
let meta = {};
let errors = [];
let warnings = [];


const rulingTypeDict = {single: 1, double: 2, triple: 3};


const lacunaStates = [
	'broken', 'damaged', 'effaced', 'illegible', 'missing', 'traces'
];
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": ["outer"], "postprocess": id},
    {"name": "main$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main$ebnf$2", "symbols": ["after"], "postprocess": id},
    {"name": "main$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main", "symbols": ["main$ebnf$1", "start", "inter", "main$ebnf$2", "END"], "postprocess":  
        d => {
        	let [outer, start, inter, after, END] = d;
        	outer = flatAll(outer);
        	start = flatAll(start);
        	inter = flatAll(inter);
        	after = flatAll(after);
        	// ToDo: add `start` and `after` as meta instead.
        	response = { 
        		meta: meta,
        		objects: (Array.isArray(inter)) ? inter : [inter],
        		start: start,
        		after: after,
        		...(errors.length>0)&&{errors: errors},
        		...(warnings.length>0)&&{warnings: warnings},
        	};
        	// IMPORTANT!
        	// Reset globals:
        	// console.log( 'before globals reset', {globals: [meta, errors, warnings], resopnse: response} )
        	meta = {};
        	errors = [];
        	warnings = [];
        	
        	return response;
        }
        },
    {"name": "outer", "symbols": ["outerP", "NL"]},
    {"name": "start$ebnf$1", "symbols": []},
    {"name": "start$ebnf$1$subexpression$1", "symbols": ["startP", "NL"]},
    {"name": "start$ebnf$1$subexpression$1", "symbols": ["comment", "NL"]},
    {"name": "start$ebnf$1", "symbols": ["start$ebnf$1", "start$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "start", "symbols": ["ampStatement", "NL", "start$ebnf$1"]},
    {"name": "inter$ebnf$1", "symbols": ["OBJECT"]},
    {"name": "inter$ebnf$1", "symbols": ["inter$ebnf$1", "OBJECT"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "inter", "symbols": ["inter$ebnf$1"]},
    {"name": "after$ebnf$1", "symbols": ["NL"], "postprocess": id},
    {"name": "after$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "after", "symbols": ["afterP", "after$ebnf$1"]},
    {"name": "OBJECT$subexpression$1", "symbols": ["object", "NL", "object_tail"]},
    {"name": "OBJECT$subexpression$1", "symbols": ["seal_object", "NL", "seal_object_tail"]},
    {"name": "OBJECT", "symbols": ["OBJECT$subexpression$1"], "postprocess": 
        d => {
        	d = flatAll(d);
        	let object = d.shift();
        	object.children = d;
        	return object;
        }
        },
    {"name": "seal_object_tail$ebnf$1", "symbols": []},
    {"name": "seal_object_tail$ebnf$1", "symbols": ["seal_object_tail$ebnf$1", "COLUMN"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "seal_object_tail", "symbols": ["seal_object_tail$ebnf$1"]},
    {"name": "seal_object_tail$ebnf$2", "symbols": []},
    {"name": "seal_object_tail$ebnf$2", "symbols": ["seal_object_tail$ebnf$2", "children_text_seal"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "seal_object_tail", "symbols": ["seal_object_tail$ebnf$2"]},
    {"name": "object_tail$ebnf$1", "symbols": []},
    {"name": "object_tail$ebnf$1$subexpression$1$subexpression$1", "symbols": ["interP"]},
    {"name": "object_tail$ebnf$1$subexpression$1$subexpression$1", "symbols": ["comment"]},
    {"name": "object_tail$ebnf$1$subexpression$1$subexpression$1", "symbols": ["state"]},
    {"name": "object_tail$ebnf$1$subexpression$1", "symbols": ["object_tail$ebnf$1$subexpression$1$subexpression$1", "NL"]},
    {"name": "object_tail$ebnf$1", "symbols": ["object_tail$ebnf$1", "object_tail$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object_tail$ebnf$2", "symbols": ["SURFACE"]},
    {"name": "object_tail$ebnf$2", "symbols": ["object_tail$ebnf$2", "SURFACE"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object_tail", "symbols": ["object_tail$ebnf$1", "object_tail$ebnf$2"]},
    {"name": "object_tail$ebnf$3", "symbols": []},
    {"name": "object_tail$ebnf$3$subexpression$1$subexpression$1", "symbols": ["interP"]},
    {"name": "object_tail$ebnf$3$subexpression$1$subexpression$1", "symbols": ["comment"]},
    {"name": "object_tail$ebnf$3$subexpression$1$subexpression$1", "symbols": ["state"]},
    {"name": "object_tail$ebnf$3$subexpression$1", "symbols": ["object_tail$ebnf$3$subexpression$1$subexpression$1", "NL"]},
    {"name": "object_tail$ebnf$3", "symbols": ["object_tail$ebnf$3", "object_tail$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object_tail", "symbols": ["object_tail$ebnf$3"]},
    {"name": "SURFACE$ebnf$1", "symbols": []},
    {"name": "SURFACE$ebnf$1$subexpression$1", "symbols": ["state", "NL"]},
    {"name": "SURFACE$ebnf$1", "symbols": ["SURFACE$ebnf$1", "SURFACE$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "SURFACE$subexpression$1$ebnf$1", "symbols": []},
    {"name": "SURFACE$subexpression$1$ebnf$1", "symbols": ["SURFACE$subexpression$1$ebnf$1", "children_text"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "SURFACE$subexpression$1", "symbols": ["SURFACE$subexpression$1$ebnf$1"]},
    {"name": "SURFACE$subexpression$1$ebnf$2", "symbols": []},
    {"name": "SURFACE$subexpression$1$ebnf$2", "symbols": ["SURFACE$subexpression$1$ebnf$2", "COLUMN"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "SURFACE$subexpression$1", "symbols": ["SURFACE$subexpression$1$ebnf$2"]},
    {"name": "SURFACE", "symbols": ["surface", "NL", "SURFACE$ebnf$1", "SURFACE$subexpression$1"], "postprocess": 
        d => {
        	d = flatAll(d);
        	let surface = d.shift();
        	surface.children = d;
        	return surface;
        }
        },
    {"name": "COLUMN$ebnf$1", "symbols": []},
    {"name": "COLUMN$ebnf$1$subexpression$1", "symbols": ["children_text"]},
    {"name": "COLUMN$ebnf$1", "symbols": ["COLUMN$ebnf$1", "COLUMN$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "COLUMN", "symbols": ["column", "NL", "COLUMN$ebnf$1"], "postprocess": 
        d => {
        	d = flatAll(d);
        	let column = d.shift();
        	column.children = d;
        	return column;
        }
        },
    {"name": "children_text_seal", "symbols": ["LINE"]},
    {"name": "children_text_seal$subexpression$1", "symbols": ["interP"]},
    {"name": "children_text_seal$subexpression$1", "symbols": ["link"]},
    {"name": "children_text_seal$subexpression$1", "symbols": ["ruling"]},
    {"name": "children_text_seal$subexpression$1", "symbols": ["state"]},
    {"name": "children_text_seal$subexpression$1", "symbols": ["comment"]},
    {"name": "children_text_seal$subexpression$1", "symbols": ["milestone"]},
    {"name": "children_text_seal", "symbols": ["children_text_seal$subexpression$1", "NL"]},
    {"name": "children_text", "symbols": ["LINE"]},
    {"name": "children_text$subexpression$1", "symbols": ["interP"]},
    {"name": "children_text$subexpression$1", "symbols": ["link"]},
    {"name": "children_text$subexpression$1", "symbols": ["ruling"]},
    {"name": "children_text$subexpression$1", "symbols": ["state"]},
    {"name": "children_text$subexpression$1", "symbols": ["seal_impression"]},
    {"name": "children_text$subexpression$1", "symbols": ["comment"]},
    {"name": "children_text$subexpression$1", "symbols": ["milestone"]},
    {"name": "children_text", "symbols": ["children_text$subexpression$1", "NL"]},
    {"name": "ampStatement", "symbols": [(lexer.has("AMP") ? {type: "AMP"} : AMP), (lexer.has("p_number") ? {type: "p_number"} : p_number), (lexer.has("equals") ? {type: "equals"} : equals), "endtext"], "postprocess":  
        ([,p_number,,name]) => { 
        meta.name = name;
        meta.p_number = p_number.value;
        return {
        	_class: 'ampStatement',
        	p_number: p_number.value,
        	name: name 
        }}
        },
    {"name": "outerP$subexpression$1", "symbols": [(lexer.has("is") ? {type: "is"} : is)]},
    {"name": "outerP$subexpression$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "outerP", "symbols": [(lexer.has("HASH") ? {type: "HASH"} : HASH), (lexer.has("protocolOuter") ? {type: "protocolOuter"} : protocolOuter), "outerP$subexpression$1", "endtext"], "postprocess":  d => {
        	return {
        		_class: 'protocol.outer',
        		type: d[1].value,
        		value: d[3]
        }}
        },
    {"name": "startP$subexpression$1", "symbols": [(lexer.has("is") ? {type: "is"} : is)]},
    {"name": "startP$subexpression$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "startP", "symbols": [(lexer.has("HASH") ? {type: "HASH"} : HASH), (lexer.has("protocolStart") ? {type: "protocolStart"} : protocolStart), "startP$subexpression$1", "endtext"], "postprocess":  d => {
        	return {
        		_class: 'protocol.start',
        		type: d[1].value,
        		value: d[3]
        }}
        },
    {"name": "interP$subexpression$1", "symbols": [(lexer.has("is") ? {type: "is"} : is)]},
    {"name": "interP$subexpression$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "interP", "symbols": [(lexer.has("HASH") ? {type: "HASH"} : HASH), (lexer.has("protocolInter") ? {type: "protocolInter"} : protocolInter), "interP$subexpression$1", "endtext"], "postprocess":  d => {
        	return {
        		_class: 'protocol.inter',
        		type: d[1].value,
        		value: d[3]
        }}
        },
    {"name": "afterP$ebnf$1", "symbols": [(lexer.has("is") ? {type: "is"} : is)], "postprocess": id},
    {"name": "afterP$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "afterP$ebnf$2", "symbols": ["endtext"], "postprocess": id},
    {"name": "afterP$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "afterP", "symbols": [(lexer.has("HASH") ? {type: "HASH"} : HASH), (lexer.has("protocolAfter") ? {type: "protocolAfter"} : protocolAfter), "afterP$ebnf$1", "afterP$ebnf$2"], "postprocess":  d => {
        	return {
        		_class: 'protocol.after',
        		type: d[1].text,
        		...(d[3]) && { value: d[3] }
        }}
        },
    {"name": "comment", "symbols": [(lexer.has("HASH") ? {type: "HASH"} : HASH), (lexer.has("comment") ? {type: "comment"} : comment)], "postprocess":  d => {
        	return {
        		_class: 'comment',
        		value: d[1].text.replace(/^ /, '')
        	}
        }},
    {"name": "link", "symbols": [(lexer.has("LINK") ? {type: "LINK"} : LINK), "endtext"], "postprocess": 
        d => {
        	let content = d[0].value+d[1];
        	let QNumber, QLine = null;
        	if ( content ){
        		[QNumber, QLine] = content.split(' ');
        		QNumber = QNumber.match(/Q[\d]{6}/g)[0]
        	};
        	return {
        		_class: 'QLink',
        		...(QNumber) && { QNumber: QNumber },
        		...(QLine) && { QLine: QLine },
        }}
        },
    {"name": "object", "symbols": [(lexer.has("AT") ? {type: "AT"} : AT), (lexer.has("object") ? {type: "object"} : object)], "postprocess":  d => {
        return {
        	_class: 'object',
        	type: d[1].value,
        }}
        },
    {"name": "object$ebnf$1", "symbols": [(lexer.has("is") ? {type: "is"} : is)], "postprocess": id},
    {"name": "object$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object", "symbols": [(lexer.has("AT") ? {type: "AT"} : AT), (lexer.has("object_cont") ? {type: "object_cont"} : object_cont), "object$ebnf$1", "endtext"], "postprocess":  d => {
        return {
        	_class: 'object',
        	type: d[1].value, 
        	name: d[3],
        }}
        },
    {"name": "surface", "symbols": [(lexer.has("AT") ? {type: "AT"} : AT), (lexer.has("surface") ? {type: "surface"} : surface)], "postprocess":  d => {
        return {
        	_class: 'surface',
        	type: d[1].value,
        }} 
        	},
    {"name": "surface", "symbols": [(lexer.has("AT") ? {type: "AT"} : AT), (lexer.has("surface_qualified") ? {type: "surface_qualified"} : surface_qualified), "endtext"], "postprocess":  d => {
        return {
        	_class: 'surface',
        	type: d[1].value,
        	name: d[2],
        }} 
        	},
    {"name": "seal_object", "symbols": [(lexer.has("AT") ? {type: "AT"} : AT), (lexer.has("seal_object") ? {type: "seal_object"} : seal_object), "endtext"], "postprocess":  d => {
        	return {
        		_class: 'object',
        		type: 'seal impression',
        		...(d[2]) && { name: d[2]},
        	};
        }
        },
    {"name": "column", "symbols": [(lexer.has("AT") ? {type: "AT"} : AT), (lexer.has("column") ? {type: "column"} : column), "endtext"], "postprocess":  d => {
        var name = d[2].replace(' ', '');
        return {
        	_class: 'column',
        	name: name
        }} 
        },
    {"name": "milestone", "symbols": [(lexer.has("AT") ? {type: "AT"} : AT), (lexer.has("milestone") ? {type: "milestone"} : milestone), "endtext"], "postprocess":  d => {
        var name = d[2];
        return {
        	_class: 'milestone',
        	name: name
        }}
        },
    {"name": "ruling", "symbols": ["BUCK", (lexer.has("ruling_type") ? {type: "ruling_type"} : ruling_type), (lexer.has("WS") ? {type: "WS"} : WS), (lexer.has("ruling") ? {type: "ruling"} : ruling)], "postprocess":  d => {
        	let repeat = (rulingTypeDict[d[1].value]) ? rulingTypeDict[d[1].value] : 1;
        	return {
        		_class: 'ruling',
        		repeat: repeat,
        }}
        },
    {"name": "seal_impression", "symbols": ["BUCK", (lexer.has("seal") ? {type: "seal"} : seal), (lexer.has("endtext") ? {type: "endtext"} : endtext)], "postprocess":  d => { 
        	return {
        		_class: 'seal',
        		...(d[2]) && { name: d[2]},
        	};
        }
        },
    {"name": "state", "symbols": ["state_strict"]},
    {"name": "state", "symbols": ["state_loose"]},
    {"name": "state_strict$ebnf$1", "symbols": ["qualification"], "postprocess": id},
    {"name": "state_strict$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "state_strict$ebnf$2", "symbols": ["extent"], "postprocess": id},
    {"name": "state_strict$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "state_strict$ebnf$3", "symbols": ["scope"], "postprocess": id},
    {"name": "state_strict$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "state_strict$ebnf$4", "symbols": ["scope_NS"], "postprocess": id},
    {"name": "state_strict$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "state_strict$ebnf$5", "symbols": ["flag"], "postprocess": id},
    {"name": "state_strict$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "state_strict", "symbols": ["BUCK", "state_strict$ebnf$1", "state_strict$ebnf$2", "state_strict$ebnf$3", "state", "state_strict$ebnf$4", "state_strict$ebnf$5"], "postprocess":  d => {
        	let flag = null;
        	if (d[6] && 'text' in d[6]){
        		if (d[6].text && d[6].text!==[]){
        			flag = d[6].text;
        		};
        	};
        	let qualification = (d[1]) ? d[1] : null;
        	let extent = (d[2]) ? d[2] : null;
        	let scope = (d[3]) ? d[3] : (d[5]) ? d[5] : null;
        	let state = (d[4]) ? d[4] : null;
        	let lacuna = lacunaStates.includes(state);
        	return {
        		_class: 'state', 
        		type: 'strict',
        		qualification: qualification,
        		extent: extent,
        		scope: scope, 
        		state: state,
        		flag: flag,
        }}
        },
    {"name": "state_loose", "symbols": ["BUCK", (lexer.has("stateLoose") ? {type: "stateLoose"} : stateLoose)], "postprocess":  d => { 
        	return {
        		_class: 'state',
        		type: 'loose',
        		value: d[1].text,
        	};
        } 
        },
    {"name": "flag$ebnf$1", "symbols": []},
    {"name": "flag$ebnf$1", "symbols": ["flag$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flag$ebnf$2", "symbols": [(lexer.has("flag") ? {type: "flag"} : flag)]},
    {"name": "flag$ebnf$2", "symbols": ["flag$ebnf$2", (lexer.has("flag") ? {type: "flag"} : flag)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flag", "symbols": ["flag$ebnf$1", "flag$ebnf$2"], "postprocess": d => { return d[1] }},
    {"name": "qualification$ebnf$1", "symbols": []},
    {"name": "qualification$ebnf$1", "symbols": ["qualification$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "qualification", "symbols": ["qualification$ebnf$1", (lexer.has("qualification") ? {type: "qualification"} : qualification)], "postprocess": d => { return d[1] }},
    {"name": "extent$ebnf$1", "symbols": []},
    {"name": "extent$ebnf$1", "symbols": ["extent$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "extent$subexpression$1", "symbols": [(lexer.has("extent") ? {type: "extent"} : extent)]},
    {"name": "extent$subexpression$1$ebnf$1", "symbols": [(lexer.has("_of") ? {type: "_of"} : _of)], "postprocess": id},
    {"name": "extent$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "extent$subexpression$1", "symbols": [(lexer.has("extent_of") ? {type: "extent_of"} : extent_of), "extent$subexpression$1$ebnf$1"]},
    {"name": "extent", "symbols": ["extent$ebnf$1", "extent$subexpression$1"], "postprocess":  
        d => { return (d[1][0]) ? d[1][0].value : d[1].value } 
        },
    {"name": "scope$ebnf$1", "symbols": []},
    {"name": "scope$ebnf$1", "symbols": ["scope$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "scope", "symbols": ["scope$ebnf$1", (lexer.has("scope") ? {type: "scope"} : scope)], "postprocess": d => d[1].value},
    {"name": "scope_NS$ebnf$1", "symbols": []},
    {"name": "scope_NS$ebnf$1", "symbols": ["scope_NS$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "scope_NS", "symbols": ["scope_NS$ebnf$1", (lexer.has("scope_NS") ? {type: "scope_NS"} : scope_NS)], "postprocess": d => d[1].value},
    {"name": "state$ebnf$1", "symbols": []},
    {"name": "state$ebnf$1", "symbols": ["state$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "state", "symbols": ["state$ebnf$1", (lexer.has("state") ? {type: "state"} : state)], "postprocess": d => d[1].value},
    {"name": "BUCK", "symbols": [(lexer.has("BUCK") ? {type: "BUCK"} : BUCK), (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": d => null},
    {"name": "LINE$subexpression$1", "symbols": ["line"]},
    {"name": "LINE$subexpression$1", "symbols": ["lineLoose"]},
    {"name": "LINE", "symbols": ["LINE$subexpression$1", "NL"], "postprocess": 
        ( d ) => {
        	if (!d[0][0]) {return null};
        	let {inlineStr, name, toLine, type} = d[0][0];
        	let data = parse(ATFTextP, 'inline', inlineStr+' \n');
        	let inline = data.inline;
        	let children = (inline) ? inline : [];
        	if (data.errors.length>0){ 
        		errors = [
        			...errors, 
        			...data.errors.map( e => {e.line = toLine; return e}  )
        		]
        	}
        	if (data.warnings.length>0){ 
        		warnings = [
        			...warnings, 
        			...data.warnings.map( w => {w.line = toLine; return w} )
        		]
        	}
        	name = name.replace(/\.[ |\t]+/, '') //remove '.' space / tab
        	return {
        		_class: 'line',
        		name: name,
        		children: children,
        		toLine: toLine,
        		...(type) && { type: type },
        	};
        }
        },
    {"name": "line", "symbols": [(lexer.has("LINE") ? {type: "LINE"} : LINE), "endtext"], "postprocess": 
        d => {
        	if (!d[1]) {return null};
        	return { inlineStr: d[1], name: d[0].text, toLine: d[0].line }
        }
        },
    {"name": "lineLoose", "symbols": [(lexer.has("LINEloose") ? {type: "LINEloose"} : LINEloose), "endtext"], "postprocess": 
        d => {
        	if (!d[1]) {return null};
        	return { inlineStr: d[1], type: 'loose', name: d[0].text, toLine: d[0].line }
        }
        },
    {"name": "endtext", "symbols": [(lexer.has("endtext") ? {type: "endtext"} : endtext)], "postprocess": 
        d => {
        	if (d[0]) {
        		return d[0].text.replace(/^[ ]+/, '').replace(/[ ]+$/, '')
        	};
        	return null;
        }
        },
    {"name": "NL", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": d => null},
    {"name": "END", "symbols": [(lexer.has("END") ? {type: "END"} : END)], "postprocess": d => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
