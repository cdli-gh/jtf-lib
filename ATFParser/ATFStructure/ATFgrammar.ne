# Compile with 'nearleyc ATFgrammar.ne -o ATFgrammar.js'
#
#===/ import lexer /==========================================================
@{% 
	const lexer = require('./ATFTokenizer.js').lexer;
%}

@lexer lexer

#---/ Flatten all nested arrays /---------------------------------------------
@{%
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
%}

#---/ ATF inline parser /-----------------------------------------------------

@{%
const ATFTextP = require('../ATFInline/ATFtextGrammar.js');
const { parse } = require('../parserTools.js');

// Define globals here:
let meta = {};
let errors = [];
let warnings = [];
%}

#==/ Grammar begins here --> /================================================

#===/ basic structure /=======================================================

main -> outer:? start inter after:? END
{% 
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
%}

#===/ parts /=================================================================
outer -> outerP NL

#note that startOrder is obliagatory (:+) in Oracc
start -> ampStatement NL (startP NL | comment NL):*

inter -> OBJECT:+

after -> afterP NL:?

OBJECT -> ( object NL object_tail | seal_object NL seal_object_tail )
{%
d => {
	d = flatAll(d);
	let object = d.shift();
	object.children = d;
	return object;
}
%}

seal_object_tail -> COLUMN:* | children_text_seal:*
object_tail ->
	  (( interP | comment | state ) NL):* SURFACE:+
	| (( interP | comment | state ) NL):*

SURFACE -> surface NL (state NL):* (children_text:* | COLUMN:*)
{%
d => {
	d = flatAll(d);
	let surface = d.shift();
	surface.children = d;
	return surface;
}
%}

COLUMN -> column NL (children_text):*
{%
d => {
	d = flatAll(d);
	let column = d.shift();
	column.children = d;
	return column;
}
%}

children_text_seal -> 
	LINE
	| ( interP | link | ruling | state | comment | milestone ) NL

children_text -> 
	LINE
	| ( interP | link | ruling | state | seal_impression | comment | milestone) NL

#===/ &-statement /===========================================================

ampStatement -> %AMP %p_number %equals endtext {% 
	([,p_number,,name]) => { 
	meta.name = name;
	meta.p_number = p_number.value;
	return {
		_class: 'ampStatement',
		p_number: p_number.value,
		name: name 
	}}
%}

#===/ #-statement /===========================================================

#---/ Protocols /-------------------------------------------------------------

outerP -> %HASH %protocolOuter (%is | %WS) endtext
{% d => {
	return {
		_class: 'protocol.outer',
		type: d[1].value,
		value: d[3]
}}
%}

startP -> %HASH %protocolStart (%is | %WS) endtext
{% d => {
	return {
		_class: 'protocol.start',
		type: d[1].value,
		value: d[3]
}}
%}

interP -> %HASH %protocolInter (%is | %WS) endtext
{% d => {
	return {
		_class: 'protocol.inter',
		type: d[1].value,
		value: d[3]
}}
%}

afterP -> %HASH %protocolAfter %is:? endtext:?
{% d => {
	return {
		_class: 'protocol.after',
		type: d[1].text,
		...(d[3]) && { value: d[3] }
}}
%}

#---/ Comments and links /----------------------------------------------------
 
comment -> %HASH %comment
{% d => {
	return {
		_class: 'comment',
		value: d[1].text.replace(/^ /, '')
	}
}%}


link -> %LINK endtext
{%
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
%}

#===/ @-statement /===========================================================

#---/ Medium & text structure /-----------------------------------------------

object -> %AT %object 
{% d => {
	return {
		_class: 'object',
		type: d[1].value,
	}}
%}
	| %AT %object_cont %is:? endtext
# note that some texts incorrectly use %is.
{% d => {
	return {
		_class: 'object',
		type: d[1].value, 
		name: d[3],
	}}
%}

surface -> %AT %surface
	{% d => {
		return {
			_class: 'surface',
			type: d[1].value,
		}} 
	%}
	| %AT %surface_qualified endtext
	{% d => {
		return {
			_class: 'surface',
			type: d[1].value,
			name: d[2],
		}} 
	%}

seal_object -> %AT %seal_object endtext
# seal object
# for seal text representation, s. seal_impression
{% d => {
	return {
		_class: 'object',
		type: 'seal impression',
		...(d[2]) && { name: d[2]},
	};
}
%}

column -> %AT %column endtext
{% d => {
	var name = d[2].replace(' ', '');
	return {
		_class: 'column',
		name: name
	}} 
%}

milestone -> %AT %milestone endtext
{% d => {
	var name = d[2];
	return {
		_class: 'milestone',
		name: name
	}}
%}

#===/ $-lines /===============================================================

#---/ Ruling /----------------------------------------------------------------

@{%
const rulingTypeDict = {single: 1, double: 2, triple: 3};
%}

ruling -> BUCK %ruling_type %WS %ruling
{% d => {
	let repeat = (rulingTypeDict[d[1].value]) ? rulingTypeDict[d[1].value] : 1;
	return {
		_class: 'ruling',
		repeat: repeat,
}}
%}

#---/ Seal impression /-------------------------------------------------------

seal_impression -> BUCK %seal %endtext
# seal instance in text
# for seal content, see seal_object
{% d => { 
	return {
		_class: 'seal',
		...(d[2]) && { name: d[2]},
	};
}
%}

#---/ State /-----------------------------------------------------------------

state -> state_strict | state_loose

@{%
const lacunaStates = [
	'broken', 'damaged', 'effaced', 'illegible', 'missing', 'traces'
];
%}

state_strict -> BUCK qualification:? extent:? scope:? state scope_NS:? flag:?
{% d => {
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
%}

state_loose -> BUCK %stateLoose
{% d => { 
	return {
		_class: 'state',
		type: 'loose',
		value: d[1].text,
	};
} 
%}

#---/ Strict state components /-----------------------------------------------

flag -> %WS:* %flag:+
{% d => { return d[1] }  %}

qualification -> %WS:* %qualification
{% d => { return d[1] }  %}

extent -> %WS:* (%extent | %extent_of %_of:?) 
# note that strict state in O-ATF ALWAYS has 'of'
{% 
d => { return (d[1][0]) ? d[1][0].value : d[1].value } 
%}

scope -> %WS:* %scope
{% d => d[1].value %}

scope_NS -> %WS:* %scope_NS # non-strict scope
{% d => d[1].value %}

state -> %WS:* %state
{% d => d[1].value %}

BUCK -> %BUCK %WS
{% d => null %}

#===/ Text lines /============================================================

LINE -> ( line | lineLoose ) NL
{%
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
%}

line -> %LINE endtext
{%
d => {
	if (!d[1]) {return null};
	return { inlineStr: d[1], name: d[0].text, toLine: d[0].line }
}
%}

lineLoose -> %LINEloose endtext
{%
d => {
	if (!d[1]) {return null};
	return { inlineStr: d[1], type: 'loose', name: d[0].text, toLine: d[0].line }
}
%}

endtext -> %endtext 
{%
d => {
	if (d[0]) {
		return d[0].text.replace(/^[ ]+/, '').replace(/[ ]+$/, '')
	};
	return null;
}
%}

NL -> %NL {% d => null %}

END -> %END {% d => null %}
