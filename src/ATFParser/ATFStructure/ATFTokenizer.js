/*---/ Imports /------------------------------------------------------------*/

/* Use moo */
// https://github.com/no-context/moo
const moo = require('moo');

/* Example: */ 
// const moo = require('moo')
// const lexer = moo.compile(lexerData);

/*---/ moo lexer data /-----------------------------------------------------*/

const lexerData = { 
	
	main: {
		END: "␃",
		AMP:	{match: /(?:^)&/, push: 'amp'},
		HASH:	{match: /(?:^)#/, push: 'hash'},
		AT:	{match: /(?:^)@/, push: 'at'},
		BUCK:	{match: /(?:^)\$/, push: 'buck'},
		LINE:	{match: /(?:^)[1-9][0-9]*[']*\.[ \t]+/, next: 'REST'},
		LINEloose:	{match: /(?:^)[^ \n]+\.[ \t]+/, next: 'REST'},
		LINK:	{match: /(?:^)(?:>>|\|\||<<)/, next: 'REST'},
		NL:	{match: /[ ]{0,}\r?\n/, lineBreaks: true},
	},
	/* AMP arguments */
	amp: {
		equals:	' = ',
		p_number:	/[P]\d{6}/,
		endtext:	{match: /[^].+(?=$)/, pop: true},
	},
	/* HASH arguments */
	hash: {
		/* protocols */
		/* TODO: add 'lang', 'lemmatizer', 'syntax', 'key'
			- use feature: atf use (legacy | mylines | lexical | alignment-groups | math )
			- atf lang LANG, for values see ./data/ATFLanguageCodes.json
				
		*/
		protocolOuter:	{match: ['basket'], next: 'REST'},
		protocolStart:	{
			match: [
					'atf',
					'project',
					'bib',
					'link',
					'note',
					'version',
					'lang',
					'atflang'
				],
			next: 'REST'
			},
		protocolAfter:	{match: ['note'], next: 'REST'},
		protocolInter:	{
			match: ['bib', 'lem', 'note', 'var', 'lang', 'tr.en', 'tr.gr', 'tr.fr', 'tr.it', 'tr.sp'],
			next: 'REST'
			},
		comment:	{match: /[^].+(?=$)/, pop: true},
		/* TODO: add HASH comments here --> */
	},
	
	
	/* AT arguments */
	/* ToDO:
	# - Add @score
	#   http://oracc.ub.uni-muenchen.de/doc/help/editinginatf/scores/index.html
	#
	# - Add @translation, @label, @h1, @h2, @h3, #tr, @unit, @span + translation styling syntax
	#   http://oracc.ub.uni-muenchen.de/doc/help/editinginatf/translations/index.html
	#
	# - Add composite syntax: @composite, @div, @end
	#   http://oracc.ub.uni-muenchen.de/doc/help/editinginatf/composites/index.html
	*/
	at: { 
		object:	{match: ['tablet', 'envelope', 'prism', 'bulla'], pop: true},
		object_cont:	{match: ['fragment', 'object'], next: 'REST'},
		surface:	{match: ['obverse', 'reverse', 'left', 'right', 'top', 'bottom'], pop: true},
		surface_qualified: {match: ['face', 'surface', 'edge'], next: 'REST'},
		seal_object:	{match: ['seal'], next: 'REST'},
		column:	{match: ['column'], next: 'REST'},
		milestone:	{match: ['m=division '], next: 'REST'},
		translation:	{match: ['label', 'h1', 'h2', 'h3', 'unit', 'span'], next: 'REST'},
		composite:	{match: ['composite', 'div', 'end'], next: 'REST'},
		
		// ToDo: update REST (replace with solid rule) to match:
		//modifier:	{match: ['?', '!', '*'], pop: true},
		//prime:	{match: /[']+/, pop: true},
		
	}, 
	/* BUCK arguments */
	buck: {
		ruling_type: ['single', 'double', 'triple'],
		ruling: {match: /ruling[ ]*(?=$)/, pop: true},
		seal: ['seal impression', 'seal'],
		stateLoose: {match: /\(.+\)(?=$)/, pop: true},
		//strict
		qualification: [
			'at least', 
			'at most',
			'about'
		],
		extent: [
			/[1-9][0-9]*/,
			/[1-9][0-9]*-[1-9][0-9]*/,
			'n',
			'several',
			'some',
			'rest',
		],
		extent_of: [
			'start',
			'beginning',
			'middle',
			'end', 
		],
		scope: [
			'tablet',
			'envelope',
			'prism',
			'bulla',
			'fragment', 
			'object',
			'obverse',
			'reverse',
			'left',
			'right',
			'top',
			'bottom',
			'column',
			'columns',
			'line',
			'lines',
			'case',
			'cases',
			'surface',
		],
		state: [
			'blank', 
			'broken', 
			'damaged', 
			'effaced', 
			'illegible', 
			'missing', 
			'traces'
		],
		scope_NS: { // ATF-C only, not ATF-O-strict
			match: 'space',
			pop: true
		},
		flag: ['!', '?'],
		_of: ' of', //note that strict state ALWAYS has "of"
		WS: ' ',
		NL:	{match: /[ ]{0,}\r?\n/, lineBreaks: true, pop: true},
	},

	/* REST arguments */
	
	REST: {	
		is: {match: /: /},
		endtext: {match: /.+(?=\n)/, next: 'main'},
	},
	
/* Linkage arguments */
// http://oracc.ub.uni-muenchen.de/doc/help/editinginatf/linkage/index.html
/* ToDO: introduce syntax, incl. parallels */
  
// linkage:	['<<', '>>', '||'],
  
/* generic arguments */
  //WS:	/[ \t]+/,
  //endtext:	/[^].+(?:$)/,
};

//const lexer = moo.compile(lexerData, error=true);
module.exports.lexer = moo.states(lexerData);


