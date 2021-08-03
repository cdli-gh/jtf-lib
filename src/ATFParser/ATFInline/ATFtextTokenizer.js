// See:
// http://oracc.ub.uni-muenchen.de/doc/help/editinginatf/primer/inlinetutorial/index.html
// http://oracc.museum.upenn.edu/ns/gdl/1.0/index.html

/*---/ Imports /------------------------------------------------------------*/

/* Use moo */
// https://github.com/no-context/moo
const moo = require('moo')

// Sign value regexps:

var v = /[aeiu]/;
var V = /[AEIU]/;
var c_universal = /ʾ|'/;
var c_CDLI = /(?:sz|ts|s,|t,)/;
var C_CDLI = /(?:SZ|TS|S,|T,)/;
var c = /[bdgḫhklmnpqrsṣšśtṭwyz]/;
var C = /[BDGḪHKLMNPQRSṢŠŚTṬWYZŊ]/;

var c_el = new RegExp('(?:'+c_CDLI.source+'|'+c.source+'|'+c_universal.source+')');
var C_el = new RegExp('(?:'+C_CDLI.source+'|'+C.source+'|'+c_universal.source+')');
var brk = /(?:[\[\]])/

// ToDo: 
// Find and fix:
// 	VAL swallows following '|'

// Symbols which are NOT part of value.
var non_val = new RegExp(
	'(?!'+
	c_CDLI.source+'|'+
	C_CDLI.source+'|'+
	c.source+'|'+
	C.source+'|'+
	c_universal.source+'|'+
	v.source+'|'+
	V.source+
	')'
);

// Single symbols to make a value.
var val_solo = new RegExp(
	"[d|m|f|p|ʾ|'|I]"+
	non_val.source
);

var brk_c_brk = new RegExp(
	'(?:'+
	brk.source+'?'+
	c_el.source+'?'+
	brk.source+'?'+
	')'
);

var brk_C_brk = new RegExp(
	'(?:'+
	brk.source+'?'+
	C_el.source+'?'+
	brk.source+'?'+
	')'
);

// Plain value.
var val = new RegExp(
	'(?:'+
	brk_c_brk.source+'?'+
	v.source+
	brk_c_brk.source+'?'+
	')+'+
	non_val.source+'|'+
	val_solo.source+non_val.source
);

// Capitalized value.
var VAL = new RegExp(
	'(?:'+
	brk_C_brk.source+'?'+
	V.source+
	brk_C_brk.source+'?'+
	')+'+
	non_val.source
);

/*---/ Token blocks /-------------------------------------------------------*/

var numTokens = {
	// Numeric tokens.
	num_s: /[₁-₉][₀-₉]*/, // full:/[₁|₂|₃|₄|₅|₆|₇|₈|₉][₀|₁|₂|₃|₄|₅|₆|₇|₈|₉]*/,
	frac: ['1/2', '1/3', '2/3', '1/4', '5/6', '1/8'],
	num: /[1-9][0-9]*/,
};

var numElpTokens = {
	// Numeric ellipsis tokens.
	n: new RegExp('n'+non_val.source),
	N: new RegExp('N'+non_val.source),
	num_plhd_plus: new RegExp('[n|N]\+[1-9][0-9]*'+non_val.source),
};

var CVTokens = {
	// Vowel and consonant tokens. 
	VAL: VAL,
	val: val,
	c_universal: /ʾ|'/,
};

var CVLTokens = {
	// Vowel and consonant tokens for CDLI logograms.
	VALL: VAL,
	valL: val,
	c_universal: /ʾ|'/,
};

var glossTokens = {
	// Ling. & doc. glosses 
	lingGlO: '{{',
	lingGlC: '}}',
	DocGlO: '{(',
	DocGlC: '})',
	
	PrsExcO: '<<',
	PrsExcC: '>>',
	
	ElpO: '<(',
	ElpC: ')>',
	
	PrsMisO: '<',
	PrsMisC: '>',
	
	/*Important: there are 2 types of ellipsis:
	After WS | after grapheme
	E.g. : 
	
	1. {d}suen he₂-me-en
	2. {d}nanna <(he₂-me-en)>

	1. a    = %a mu-u₂
	2. illu = %a MIN<(mu-u₂)>
	
	*/
	// compound brackets: comments in grapheme sequence
	CmpO: '(#',
	CmpC: /#\)(?= |$)/,
	
	glossO: '{+',
	ScrO: /\{[0-9]/, //script gloss
	detO: '{',
	gdC: '}', //used to close glossO, detO, ScrO 
	brkO: '[',
	brkC: ']',
};

var XTokens = {
	// x tokens.
	x_l: 'X',
	x_s: 'x', 
	x_u: 'ₓ',
};

var XLTokens = {
	// x tokens in CDLI logogram.
	xL_l: 'X',
	xL_s: 'x', 
	x_u: 'ₓ',
};

var punctTokens = {
	//ToDo: Add to grammar, seq. level
	punct: /:[='".](?= |$)/,
	punct_q: /[*\/](?= |$)/,
	punct_s: /\/\(P[1-4]\)/,
};

var GDLModTokens = {
	// GDL modifier tokens.
	mod: ['@b', '@c', '@f', '@g', '@s', '@t', '@n', '@z', '@k', '@r', '@h', '@v', '@cv'],
	mod_rotate: /@\d[\d]{0,2}/,
	//allogr: /~[a-wyz]+|~[\d]+|~[a-wyz]+[\d]+/, //allographs
	allogr: /~[a-wyz\d]{1,6}|~x/, //allographs
	mod_xX: 'xX', // for contains X, i.e. ×X. not an ATF mod (!)
};

var GDLUnitTokens = {
	// GDL unit tokens.
	//unit: /bariga|barig|bur'u|gesz'u|geš'u|bur3|bur₃|ban2|ban₂|disz|diš|asz|aš|u/,
	//unit_cap: /BARIGA|BARIG|BUR'U|BUR3|BUR₃|BAN2|BAN₂|GESZ'U|GEŠ'U|DISZ|DIŠ|AŠ|ASZ|U/,
};

var GDLOpTokens = {
	// GDL operator tokens.
	opBeside: ['.', '-'],
	opJoining: '+',
	opContaining: ['×', 'x'],
	opAbove: '&',
	opCrossing: '%',
	opOpposing: '@',
	opReversed: ':',
	opAlternative: '/',
};

// http://oracc.ub.uni-muenchen.de/doc/help/editinginatf/advancedconventions/index.html
// ToDo: Make sure all convention added and function

var fieldTokens = {
	followSV: /(?: |^)#|,!sv(?= |$)/,
	followPR: /(?: |^)"|,!pr(?= |$)/,
	followSG: /(?: |^)~|,!sg(?= |$)/,
	//followSN: /(?: )\||,!sn(?= |$)/, //! Misinterprets cases like "1(N01) , |LAGAB~axZATU753|"
	followEq: /(?: |^)=|,!eq(?= |$)/,
	followWP: /(?: |^)\^|,!wp(?= |$)/,
	followCS: /(?: |^)@|,!cs(?= |$)/,
	fieldSep: /(?: |^),(?= |$)/,
	columnSep:  /(?: |^)&(?= |$)/,
};

/*
ToDo:
- split name and index of signlists (!)
*/

var SL_values = [
	'ABZ', 'BAU', 'HZL', 'KWU', 'LAK', 'MEA',
	'MZL', 'REC', 'RSP', 'ZATU', 'UET2_'
];

module.exports.SL_re = new RegExp('('+SL_values.join('|')+')([\\da-zA-Z]+)');

var signList_ref = {
	SL_name: {
		match: new RegExp(SL_values.join('|')),
		value: val => (toString(val).includes('_')) ? val.repalce('_', '') : val,
		push: 'ref_SL_number',
	},
};

var signList_builtIn = {
	SL_PC: /N[\d]{1,2}[A-WYZ|a-wyz]{0,2}(?=\W|$)/, //proto-cuneiform
	SL_PC_s: /N[₀|₁|₂|₃|₄|₅|₆|₇|₈|₉]{2}(?=\W|$)/, //proto-cuneiform
	SL_PE: /M[\d]{1,3}/, // proto-Elamite
	SL_PE_s: /M[₀|₁|₂|₃|₄|₅|₆|₇|₈|₉]{2}(?=\W|$)/, //proto-cuneiform
};

/*---/ States /-------------------------------------------------------------*/

var main = {
	// main state.
	NL:	{match: /\r?\n/, lineBreaks: true}, // /[ ]{0,}\r?\n/
	...fieldTokens, //before WS
	...signList_builtIn,
	WS:	 / +/,
	inlineComment: /\(\$.+\$\)(?= |$)/,
	// ToDo:
	// find a better solution
	// should handle: [...] [(...)] [x (x x)] [(ugula)] etc.
	// phps a routing rule for square brackets ?
	brkElp: /\(\.\.\.\)|\.\.\.|\(x(?= x)*\)|\(X(?= X)*\)/,
	prtGDL: {match: '|', push: 'ref_GDL'},
	prtO: {match: '(', push: 'ref_prt'},
	log_: {match: '_', push: 'logo'},
	...signList_ref,
	...GDLModTokens,
	...numTokens,
	...CVTokens,
	...XTokens,
	...glossTokens,
	...punctTokens,
	...numElpTokens,
	flag: ['?', '*', '!'],
	brk: '#',
	div: ['.', '-'],
	div_special: ['+', ':', '/'],
};

var logo = {
	// CDLI logograms and non-syllabic (enclosed with '_').
	//signEnd: /(?= |\.|-|\+|\{|\})/,
	brkElp: /\(\.\.\.\)|\.\.\./,
	prtGDL: {match: '|', push: 'ref_GDL'},
	prtO: {match: '(', push: 'ref_prt'},
	prtCa: ')a',
	log_: {match: '_', pop: true}, // CDLI logogram-specific
	WS: / +/,
	...CVLTokens, // CDLI logogram-specific
	...XLTokens,
	...numElpTokens,
	flag: ['?', '*', '!'],
	...glossTokens,
	...punctTokens,
	brk: '#',
	...GDLModTokens,
	...numTokens,
	div: ['.', '-'],
	div_special: ['+', ':', '/'],
};

var ref = {
	// GDL references.
	brkElp: /\(\.\.\.\)|\.\.\./,
	brkO: '[',
	brkC: ']',
	...signList_ref,
	...signList_builtIn,
	...GDLModTokens,
	...numElpTokens,
	...CVTokens,
	//ToDo: * verify that diš@v, diš@t, bur'u@v, 1/2@v, 4(dic@v@v) etc. render correctly in UqNU
	formvar: '\\',
	...XTokens,
	...GDLOpTokens,
	...GDLUnitTokens,
	flag: ['?', '*', '!'],
	brk: '#',
	num: main.num,
	num_s: main.num_s,
	div: ['.', '-'],
	div_special: ['+', ':', '/'],
	WS: / +/,
};

var ref_prt = {
	// ref within ( )
	prtO: {match: '(', push: 'ref_prt'},
	prtGDL: {match: '|', push: 'ref_GDL'},
	prtCa: {match: ')a', pop: true},
	prtC: {match: ')', pop: true},
	...ref,
};

var ref_GDL = {
	// ref within | |
	prtGDL: {match: '|', pop: true},
	prtO: {match: '(', push: 'ref_prt'},
	...ref,
};

ref_SL_number = {
	SL_number: { match: /[\da-wA-W]+/, pop: true}, //IMPORTANT: exclude x/X
};

/*---/ moo lexer data /-----------------------------------------------------*/

const lexerData = { 
	
	main: main,
	logo: logo, //Logograms in CDLI
	ref_prt: ref_prt,
	ref_GDL: ref_GDL,
	ref_SL_number: ref_SL_number,
};

//v: /a|e|i|u/,
//c: /'|b|d|g|ḫ|k|l|m|n|p|r|s|ṣ|š|t|w|y|z/,

module.exports.lexer = moo.states(lexerData);