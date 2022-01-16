// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
 
    const lexer = require('./ATFtextTokenizer.js').lexer;


    const flatAll = require('./postprocessors.js').flatAll;
    const escapeSNum = require('./postprocessors.js').escapeSNum;

 
const makeFields = ( d ) => {
        // Pack content to fields 
    let newData = [];
    let fieldSepArr = d.map( 
        (c, i) => ('fieldSeparator' in c) ? i : null )
        .filter( c => c!==null );
    if (fieldSepArr.length===0){ return d }
    let begin = ( fieldSepArr[0]===0 ) ? [] : [-1];
    fieldSepArr = [...begin, ...fieldSepArr]
    fieldSepArr.forEach( (startIndex, i ) => {
        let field = ( d[startIndex] ) ? d[startIndex].fieldSeparator : null;
        let endIndex = fieldSepArr[i+1]
        if ( !field ){
            field = d[endIndex].fieldSeparator
        };
        if ( !endIndex ){
            endIndex = d.length
        };
        let children = d.slice( startIndex+1, endIndex ).filter( c => !c.fieldSeparator );
        let type = ( field!=='field' ) ? { type: field } : { }
        newData.push( { _class: 'field', ...type, children: children } )
    })
    return newData;
}


    let continuedBreak = false;
    let continuedLogogram = false; //ToDo: add function, as with break ?
    let continuedGloss = false; //ToDo: add function / wrap in class ?


const makeSign = ( d ) => { 
    //
    d = flatAll(d);
    let chr = d.shift(); //ToDo: make this work with opRepeat (!)
    return add2Sign(chr, d);
};

const add2Sign = ( chr, d ) => { 
    //
    let chrTail = [];
    chr.modifiers = [];
    d.forEach( el => {
        if (el.type==='brk') {
            chr.damage = '#';
        } else if (el.type==='flag'){
            if (el.children.includes('!')){ chr.exclamation = true };
            if (el.children.includes('?')){ chr.question = true };
        } else if (el.reference){
            if (chr.type.includes('num')) {
                chr.unit = el.reference;
                if (chr.unit.type && !chr.unit.type.match(/sListRef|GDL/g)) {
                  chr.unit.type = 'log'
                };
            } else {
                chr.reference = removeType(el.reference);
            }
        } else if (el._class==='GDLModifier') {
            chr.modifiers.push( el )
            //console.log('modifier added', chr, el)
        } else {
            //console.log('untreated sign element', el);
            chrTail.push( el );
        }
        });
    if (chr.type && chr.type.includes('GDL')){
        //console.log( chr, d )
    }
    if (chr.modifiers.length===0){ delete chr.modifiers }
    return [chr, ...chrTail];
};

const removeType = ( chr ) => {
    // remove type in array. E.g. for references / units.
    delete chr.type;
    return chr;
};



const makeBreaks = ( chr ) => {
    // add breaks to chr when '[' and ']' are inside value.
    // true if fully damaged and '#' if partly, CDLI-style.
    if (!chr.value){ return chr };
    if (!/[\[\]]/.test(chr.value)) { return chr };
    let indiciesBroken = [];
    let counter = 0;
    chr.value.split('').forEach( ( c, i ) => {
        if (c==='['){ 
            continuedBreak = true;
            counter++
        } else if (c===']'){ 
            continuedBreak = false;
            counter++
        } else if ( continuedBreak ) {
            indiciesBroken.push( i-counter ) 
        };
    });
    chr.value = chr.value.replace(/[\[\]]/g, '');
    //ToDo: make preciser break storage
    chr.damage = (chr.value.length===indiciesBroken.length) ? true : '#';
    return chr;
};


    const modNamed = {
            c: 'curved',
            f: 'flat',
            g: 'gunû', //4 extra wedges
            s: 'šeššig', //added še-sign
            t: 'tenû', //slanting
            n: 'nutillû', //unfinished
            z: 'zidatenû', //slanting right
            k: 'kabatenû', //slanting left
            r: 'y-reflected', //vertically reflected
            h: 'x-reflected', //horizontally reflected
            v: 'variant',
    }
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["main_chain"]},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["main_chain_non_linear"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1$subexpression$1"]},
    {"name": "main$ebnf$1$subexpression$2", "symbols": ["main_chain"]},
    {"name": "main$ebnf$1$subexpression$2", "symbols": ["main_chain_non_linear"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1", "NL"], "postprocess":  d => {
            d = flatAll( d );
            //console.log(d)
            d = makeFields( d );
            return { inline: d };
        } 
        },
    {"name": "main_chain_non_linear$ebnf$1", "symbols": []},
    {"name": "main_chain_non_linear$ebnf$1$subexpression$1", "symbols": ["WS", "INLINE_CORE"]},
    {"name": "main_chain_non_linear$ebnf$1", "symbols": ["main_chain_non_linear$ebnf$1", "main_chain_non_linear$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main_chain_non_linear$ebnf$2", "symbols": []},
    {"name": "main_chain_non_linear$ebnf$2", "symbols": ["main_chain_non_linear$ebnf$2", "fSep"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main_chain_non_linear", "symbols": ["prtO", "INLINE_CORE", "main_chain_non_linear$ebnf$1", "prtCa", "main_chain_non_linear$ebnf$2", "WS"]},
    {"name": "main_chain$ebnf$1", "symbols": ["INLINE_CORE"], "postprocess": id},
    {"name": "main_chain$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main_chain$ebnf$2", "symbols": []},
    {"name": "main_chain$ebnf$2", "symbols": ["main_chain$ebnf$2", "fSep"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main_chain", "symbols": ["main_chain$ebnf$1", "main_chain$ebnf$2", "WS"]},
    {"name": "INLINE_CORE$subexpression$1", "symbols": ["inlineComment"]},
    {"name": "INLINE_CORE$subexpression$1", "symbols": ["SEQUENCE"]},
    {"name": "INLINE_CORE", "symbols": ["INLINE_CORE$subexpression$1"]},
    {"name": "inlineComment", "symbols": [(lexer.has("inlineComment") ? {type: "inlineComment"} : inlineComment)], "postprocess":  d => {
        return { 
        _class: 'inlineComment',
        value: d.value.replace(/\(\$ | \$\)/g, ''),
        }}
        },
    {"name": "SEQUENCE$subexpression$1", "symbols": ["SEQ_SHORT"]},
    {"name": "SEQUENCE$subexpression$1", "symbols": ["SEQ_LONG"]},
    {"name": "SEQUENCE$subexpression$1", "symbols": ["SEQ_INCOMPLETE"]},
    {"name": "SEQUENCE", "symbols": ["SEQUENCE$subexpression$1"], "postprocess":  
        d => {
            d = flatAll(d);
            return d;
        }
        },
    {"name": "SEQ_INCOMPLETE", "symbols": ["D"], "postprocess":  
        d => {
            return {_class: 'sequence', type: 'incomplete', children: flatAll(d)};
        }
        },
    {"name": "SEQ_SHORT", "symbols": ["SIGN"], "postprocess":  
        d => {
            return {_class: 'sequence', type: 'short', children: flatAll(d)};
        }
        },
    {"name": "SEQ_LONG$subexpression$1$subexpression$1", "symbols": ["SEQ_CORE"]},
    {"name": "SEQ_LONG$subexpression$1$subexpression$1", "symbols": ["SIGN"]},
    {"name": "SEQ_LONG$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": ["SEQ_CORE"]},
    {"name": "SEQ_LONG$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": ["SIGN"]},
    {"name": "SEQ_LONG$subexpression$1$ebnf$1$subexpression$1", "symbols": ["div", "SEQ_LONG$subexpression$1$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "SEQ_LONG$subexpression$1$ebnf$1", "symbols": ["SEQ_LONG$subexpression$1$ebnf$1$subexpression$1"]},
    {"name": "SEQ_LONG$subexpression$1$ebnf$1$subexpression$2$subexpression$1", "symbols": ["SEQ_CORE"]},
    {"name": "SEQ_LONG$subexpression$1$ebnf$1$subexpression$2$subexpression$1", "symbols": ["SIGN"]},
    {"name": "SEQ_LONG$subexpression$1$ebnf$1$subexpression$2", "symbols": ["div", "SEQ_LONG$subexpression$1$ebnf$1$subexpression$2$subexpression$1"]},
    {"name": "SEQ_LONG$subexpression$1$ebnf$1", "symbols": ["SEQ_LONG$subexpression$1$ebnf$1", "SEQ_LONG$subexpression$1$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "SEQ_LONG$subexpression$1", "symbols": ["SEQ_LONG$subexpression$1$subexpression$1", "SEQ_LONG$subexpression$1$ebnf$1"]},
    {"name": "SEQ_LONG$subexpression$1", "symbols": ["SEQ_CORE"]},
    {"name": "SEQ_LONG", "symbols": ["SEQ_LONG$subexpression$1"], "postprocess":  
        d => {
            let seq = {_class: 'sequence', type: 'long', children: flatAll(d)};
            return seq;
        }
        },
    {"name": "SEQ_CORE", "symbols": ["SEQ_GLOSS"]},
    {"name": "SEQ_CORE", "symbols": ["SEQ_DET"]},
    {"name": "SEQ_GLOSS", "symbols": ["SG_S"]},
    {"name": "SEQ_GLOSS", "symbols": ["S_GS"]},
    {"name": "SEQ_GLOSS", "symbols": ["GS"]},
    {"name": "SEQ_GLOSS", "symbols": ["SG"]},
    {"name": "GS$subexpression$1", "symbols": ["SIGN"]},
    {"name": "GS$subexpression$1", "symbols": ["SEQ_DET"]},
    {"name": "GS", "symbols": ["GLOSS", "GS$subexpression$1"]},
    {"name": "SG$subexpression$1", "symbols": ["SIGN"]},
    {"name": "SG$subexpression$1", "symbols": ["SEQ_DET"]},
    {"name": "SG", "symbols": ["SG$subexpression$1", "GLOSS"]},
    {"name": "SG_S", "symbols": ["GS", "div", "SIGN"]},
    {"name": "S_GS$subexpression$1", "symbols": ["SIGN"]},
    {"name": "S_GS$subexpression$1", "symbols": ["SEQ_DET"]},
    {"name": "S_GS", "symbols": ["S_GS$subexpression$1", "div", "GS"]},
    {"name": "SEQ_DET", "symbols": ["SD_S"]},
    {"name": "SEQ_DET", "symbols": ["S_DS"]},
    {"name": "SEQ_DET", "symbols": ["DS"]},
    {"name": "SEQ_DET", "symbols": ["SD"]},
    {"name": "SEQ_DET", "symbols": ["SDS"]},
    {"name": "SDS", "symbols": ["D", "SIGN", "D"]},
    {"name": "DS", "symbols": ["D", "SIGN"]},
    {"name": "SD", "symbols": ["SIGN", "D"]},
    {"name": "SD_S", "symbols": ["SD", "div", "SIGN"]},
    {"name": "S_DS", "symbols": ["SIGN", "div", "DS"]},
    {"name": "D$ebnf$1", "symbols": ["DET"]},
    {"name": "D$ebnf$1", "symbols": ["D$ebnf$1", "DET"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "D", "symbols": ["D$ebnf$1"]},
    {"name": "SIGN$ebnf$1", "symbols": ["SIGN_PRE"], "postprocess": id},
    {"name": "SIGN$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "SIGN$ebnf$2", "symbols": ["SIGN_POST"], "postprocess": id},
    {"name": "SIGN$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "SIGN", "symbols": ["SIGN$ebnf$1", "SIGN_CORE", "SIGN$ebnf$2"]},
    {"name": "SIGN_PRE$subexpression$1", "symbols": ["log_"]},
    {"name": "SIGN_PRE$subexpression$1", "symbols": ["PRE_BRC"]},
    {"name": "SIGN_PRE$subexpression$1", "symbols": ["log_", "PRE_BRC"]},
    {"name": "SIGN_PRE$subexpression$1", "symbols": ["PRE_BRC", "log_"]},
    {"name": "SIGN_PRE", "symbols": ["SIGN_PRE$subexpression$1"]},
    {"name": "SIGN_POST$subexpression$1", "symbols": ["log_"]},
    {"name": "SIGN_POST$subexpression$1", "symbols": ["POST_BRC"]},
    {"name": "SIGN_POST$subexpression$1", "symbols": ["log_", "POST_BRC"]},
    {"name": "SIGN_POST$subexpression$1", "symbols": ["POST_BRC", "log_"]},
    {"name": "SIGN_POST", "symbols": ["SIGN_POST$subexpression$1"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$1", "symbols": ["brkO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$1", "symbols": ["lingGlO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$1", "symbols": ["DocGlO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$1", "symbols": ["PrsExcO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$1", "symbols": ["ElpO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$1", "symbols": ["PrsMisO"]},
    {"name": "PRE_BRC$ebnf$1", "symbols": ["PRE_BRC$ebnf$1$subexpression$1"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$2", "symbols": ["brkO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$2", "symbols": ["lingGlO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$2", "symbols": ["DocGlO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$2", "symbols": ["PrsExcO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$2", "symbols": ["ElpO"]},
    {"name": "PRE_BRC$ebnf$1$subexpression$2", "symbols": ["PrsMisO"]},
    {"name": "PRE_BRC$ebnf$1", "symbols": ["PRE_BRC$ebnf$1", "PRE_BRC$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "PRE_BRC", "symbols": ["PRE_BRC$ebnf$1"]},
    {"name": "POST_BRC$ebnf$1$subexpression$1", "symbols": ["brkC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$1", "symbols": ["lingGlC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$1", "symbols": ["DocGlC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$1", "symbols": ["PrsExcC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$1", "symbols": ["ElpC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$1", "symbols": ["PrsMisC"]},
    {"name": "POST_BRC$ebnf$1", "symbols": ["POST_BRC$ebnf$1$subexpression$1"]},
    {"name": "POST_BRC$ebnf$1$subexpression$2", "symbols": ["brkC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$2", "symbols": ["lingGlC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$2", "symbols": ["DocGlC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$2", "symbols": ["PrsExcC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$2", "symbols": ["ElpC"]},
    {"name": "POST_BRC$ebnf$1$subexpression$2", "symbols": ["PrsMisC"]},
    {"name": "POST_BRC$ebnf$1", "symbols": ["POST_BRC$ebnf$1", "POST_BRC$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "POST_BRC", "symbols": ["POST_BRC$ebnf$1"]},
    {"name": "DET$ebnf$1", "symbols": ["SIGN_PRE"], "postprocess": id},
    {"name": "DET$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DET$subexpression$1", "symbols": ["DET_SIGN"]},
    {"name": "DET$subexpression$1", "symbols": ["DET_CHAIN"]},
    {"name": "DET$ebnf$2", "symbols": ["SIGN_POST"], "postprocess": id},
    {"name": "DET$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DET", "symbols": ["DET$ebnf$1", "detO", "DET$subexpression$1", "gdC", "DET$ebnf$2"]},
    {"name": "DET_CHAIN$ebnf$1$subexpression$1", "symbols": ["div", "DET_SIGN"]},
    {"name": "DET_CHAIN$ebnf$1", "symbols": ["DET_CHAIN$ebnf$1$subexpression$1"]},
    {"name": "DET_CHAIN$ebnf$1$subexpression$2", "symbols": ["div", "DET_SIGN"]},
    {"name": "DET_CHAIN$ebnf$1", "symbols": ["DET_CHAIN$ebnf$1", "DET_CHAIN$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DET_CHAIN", "symbols": ["DET_SIGN", "DET_CHAIN$ebnf$1"]},
    {"name": "DET_SIGN$ebnf$1", "symbols": ["SIGN_PRE"], "postprocess": id},
    {"name": "DET_SIGN$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DET_SIGN$ebnf$2", "symbols": ["SIGN_POST"], "postprocess": id},
    {"name": "DET_SIGN$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DET_SIGN", "symbols": ["DET_SIGN$ebnf$1", "SIGN_CORE", "DET_SIGN$ebnf$2"], "postprocess": 
        d => {
            d = flatAll(d)
            d.forEach( c => { 
                if ( c._class='chr' ) {
                    c.type = 'det';
                }
            })
            return d;
        }
        },
    {"name": "GLOSS$ebnf$1", "symbols": ["SIGN_PRE"], "postprocess": id},
    {"name": "GLOSS$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "GLOSS$ebnf$2", "symbols": ["div"], "postprocess": id},
    {"name": "GLOSS$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "GLOSS$ebnf$3", "symbols": ["SIGN_POST"], "postprocess": id},
    {"name": "GLOSS$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "GLOSS", "symbols": ["GLOSS$ebnf$1", "glossO", "GLOSS$ebnf$2", "GLOSS_CHAIN", "gdC", "GLOSS$ebnf$3"], "postprocess":  d => { 
        return { _class: 'gloss', children: d} }
        },
    {"name": "GLOSS_CHAIN$ebnf$1", "symbols": []},
    {"name": "GLOSS_CHAIN$ebnf$1$subexpression$1", "symbols": ["div", "GLOSS_SIGN"]},
    {"name": "GLOSS_CHAIN$ebnf$1", "symbols": ["GLOSS_CHAIN$ebnf$1", "GLOSS_CHAIN$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "GLOSS_CHAIN", "symbols": ["GLOSS_SIGN", "GLOSS_CHAIN$ebnf$1"]},
    {"name": "GLOSS_SIGN$ebnf$1", "symbols": ["SIGN_PRE"], "postprocess": id},
    {"name": "GLOSS_SIGN$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "GLOSS_SIGN$ebnf$2", "symbols": ["SIGN_POST"], "postprocess": id},
    {"name": "GLOSS_SIGN$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "GLOSS_SIGN", "symbols": ["GLOSS_SIGN$ebnf$1", "SIGN_CORE", "GLOSS_SIGN$ebnf$2"]},
    {"name": "fSep", "symbols": ["followSV"]},
    {"name": "fSep", "symbols": ["followPR"]},
    {"name": "fSep", "symbols": ["followEq"]},
    {"name": "fSep", "symbols": ["followWP"]},
    {"name": "fSep", "symbols": ["followCS"]},
    {"name": "fSep", "symbols": ["fieldSep"]},
    {"name": "fSep", "symbols": ["columnSep"]},
    {"name": "followSV", "symbols": [(lexer.has("followSV") ? {type: "followSV"} : followSV)], "postprocess": () => { return {fieldSeparator: 'signValue'}}},
    {"name": "followPR", "symbols": [(lexer.has("followPR") ? {type: "followPR"} : followPR)], "postprocess": () => { return {fieldSeparator: 'signPronunciation'}}},
    {"name": "followEq", "symbols": [(lexer.has("followEq") ? {type: "followEq"} : followEq)], "postprocess": () => { return {fieldSeparator: 'equivalent'}}},
    {"name": "followWP", "symbols": [(lexer.has("followWP") ? {type: "followWP"} : followWP)], "postprocess": () => { return {fieldSeparator: 'wordOrPhrase'}}},
    {"name": "followCS", "symbols": [(lexer.has("followCS") ? {type: "followCS"} : followCS)], "postprocess": () => { return {fieldSeparator: 'containedSigns'}}},
    {"name": "fieldSep", "symbols": [(lexer.has("fieldSep") ? {type: "fieldSep"} : fieldSep)], "postprocess": () => { return {fieldSeparator: 'field'}}},
    {"name": "columnSep", "symbols": [(lexer.has("columnSep") ? {type: "columnSep"} : columnSep)], "postprocess": () => { return {fieldSeparator: 'column.inline'}}},
    {"name": "SIGN_CORE$subexpression$1", "symbols": ["anyValue"]},
    {"name": "SIGN_CORE$subexpression$1", "symbols": ["GDL_object"]},
    {"name": "SIGN_CORE$ebnf$1", "symbols": ["tail"], "postprocess": id},
    {"name": "SIGN_CORE$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "SIGN_CORE", "symbols": ["SIGN_CORE$subexpression$1", "SIGN_CORE$ebnf$1"], "postprocess": 
        d => { 
          return makeSign(d)
        }
        },
    {"name": "GDL_object", "symbols": ["prtGDL", "GDL_element", "prtGDL"], "postprocess": 
        d => {
            d = flatAll(d);
            return { 
                _class: 'chr',
                type: 'GDLObject',
                children: d,
                ...(continuedBreak)&&{ damage: true }
            };
        }
        },
    {"name": "GDL_group$ebnf$1", "symbols": ["tail_GDL"], "postprocess": id},
    {"name": "GDL_group$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "GDL_group", "symbols": ["prtO", "GDL_chain", "prtC", "GDL_group$ebnf$1"], "postprocess": 
        d => { 
            let chr = {
                _class: 'chr',
                type: 'GDLGroup',
                children: flatAll(d[1]),
            };
            return [chr, d[3]];
        }
        },
    {"name": "GDL_chain$ebnf$1$subexpression$1", "symbols": ["op", "GDL_element"]},
    {"name": "GDL_chain$ebnf$1$subexpression$1", "symbols": ["opContainingX"]},
    {"name": "GDL_chain$ebnf$1", "symbols": ["GDL_chain$ebnf$1$subexpression$1"]},
    {"name": "GDL_chain$ebnf$1$subexpression$2", "symbols": ["op", "GDL_element"]},
    {"name": "GDL_chain$ebnf$1$subexpression$2", "symbols": ["opContainingX"]},
    {"name": "GDL_chain$ebnf$1", "symbols": ["GDL_chain$ebnf$1", "GDL_chain$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "GDL_chain", "symbols": ["GDL_element", "GDL_chain$ebnf$1"]},
    {"name": "GDL_element$ebnf$1", "symbols": ["opRepeat"], "postprocess": id},
    {"name": "GDL_element$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "GDL_element$subexpression$1$ebnf$1", "symbols": ["tail_GDL"], "postprocess": id},
    {"name": "GDL_element$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "GDL_element$subexpression$1", "symbols": ["anyValue", "GDL_element$subexpression$1$ebnf$1"]},
    {"name": "GDL_element$subexpression$1", "symbols": ["GDL_group"]},
    {"name": "GDL_element$subexpression$1", "symbols": ["GDL_chain"]},
    {"name": "GDL_element", "symbols": ["GDL_element$ebnf$1", "GDL_element$subexpression$1"], "postprocess": 
        //ToDo: make this work with opRepeat (!)
        d => {
          d = flatAll(d).map( el => {
            let {_class, type } = el;
            if (_class==='chr' && type && type.match(/syl|log|det/g)){
                delete el.type;
            };
            return el;
          });
          return makeSign(d);
        }
        },
    {"name": "ref$subexpression$1", "symbols": ["GDL_object"]},
    {"name": "ref$subexpression$1$ebnf$1", "symbols": ["tail_GDL"], "postprocess": id},
    {"name": "ref$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ref$subexpression$1", "symbols": ["anyValue", "ref$subexpression$1$ebnf$1"]},
    {"name": "ref", "symbols": ["prtO", "ref$subexpression$1", "prtC"], "postprocess": 
        d => {
            d = flatAll(d);
            return { 
              reference: (d[0].type!=='GDLObject') 
                ? makeSign(d)[0]
                : d[0] 
            };
        }
        },
    {"name": "anyValue$subexpression$1", "symbols": ["value"]},
    {"name": "anyValue$subexpression$1", "symbols": ["VALUE"]},
    {"name": "anyValue$subexpression$1", "symbols": ["value_num"]},
    {"name": "anyValue$subexpression$1", "symbols": ["value_punct"]},
    {"name": "anyValue$subexpression$1", "symbols": ["sList_ref"]},
    {"name": "anyValue$subexpression$1", "symbols": ["brkElp"]},
    {"name": "anyValue", "symbols": ["anyValue$subexpression$1"], "postprocess": 
        d => {
            return makeBreaks( flatAll(d)[0] );
        }
        },
    {"name": "value", "symbols": ["val"]},
    {"name": "value", "symbols": ["c_universal"]},
    {"name": "value", "symbols": ["x_val"]},
    {"name": "VALUE", "symbols": ["VAL"]},
    {"name": "VALUE", "symbols": ["VALL"]},
    {"name": "VALUE", "symbols": ["valL"]},
    {"name": "VALUE", "symbols": ["X_val"]},
    {"name": "val$ebnf$1", "symbols": ["index"], "postprocess": id},
    {"name": "val$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "val", "symbols": [(lexer.has("val") ? {type: "val"} : val), "val$ebnf$1"], "postprocess":  
        d => { 
            d = flatAll(d);
            return {
                _class: 'chr',
                type: 'syl',
                value: d[0].value,
                ...(d[1]) && d[1], //index
        }}
        },
    {"name": "VAL$ebnf$1", "symbols": ["index"], "postprocess": id},
    {"name": "VAL$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VAL", "symbols": [(lexer.has("VAL") ? {type: "VAL"} : VAL), "VAL$ebnf$1"], "postprocess":  
        d => { 
            d = flatAll(d);
            return {
                _class: 'chr',
                value: d[0].value,
                ...(d[1]) && d[1], //index
        }}
        },
    {"name": "valL$ebnf$1", "symbols": ["index"], "postprocess": id},
    {"name": "valL$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "valL", "symbols": [(lexer.has("valL") ? {type: "valL"} : valL), "valL$ebnf$1"], "postprocess":  
        d => {
            d = flatAll(d);
            return {
                _class: 'chr',
                type: 'log',
                value: d[0].value,
                ...(d[1]) && d[1], //index
        }}
        },
    {"name": "VALL$ebnf$1", "symbols": ["index"], "postprocess": id},
    {"name": "VALL$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VALL", "symbols": [(lexer.has("VALL") ? {type: "VALL"} : VALL), "VALL$ebnf$1"], "postprocess":  
        d => {
            d = flatAll(d);
            return {
                _class: 'chr',
                type: 'log',
                value: d[0].value,
                ...(d[1]) && d[1], //index
        }}
        },
    {"name": "val_brk", "symbols": ["brkO"]},
    {"name": "val_brk", "symbols": ["brkC"]},
    {"name": "c_universal", "symbols": [(lexer.has("c_universal") ? {type: "c_universal"} : c_universal)], "postprocess":  
        d => { return {
            _class: 'chr',
            value: d[0].value
        }}
        },
    {"name": "x_val$subexpression$1", "symbols": [(lexer.has("x_s") ? {type: "x_s"} : x_s)]},
    {"name": "x_val$subexpression$1", "symbols": [(lexer.has("xL_s") ? {type: "xL_s"} : xL_s)]},
    {"name": "x_val", "symbols": ["x_val$subexpression$1"], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'uncrt.small',
            value: 'x'
        }}
        },
    {"name": "X_val$subexpression$1", "symbols": [(lexer.has("x_l") ? {type: "x_l"} : x_l)]},
    {"name": "X_val$subexpression$1", "symbols": [(lexer.has("xL_l") ? {type: "xL_l"} : xL_l)]},
    {"name": "X_val", "symbols": ["X_val$subexpression$1"], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'uncrt.large',
            value: 'X'
        }}
        },
    {"name": "brkElp", "symbols": [(lexer.has("brkElp") ? {type: "brkElp"} : brkElp)], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'broken.gap',
            value: '…',
            damage: true,
        }}
        },
    {"name": "value_num", "symbols": ["val_num"]},
    {"name": "value_num", "symbols": ["val_num_frac"]},
    {"name": "value_num", "symbols": ["val_num_plhd"]},
    {"name": "value_num", "symbols": ["val_num_plhd_plus"]},
    {"name": "val_num", "symbols": [(lexer.has("num") ? {type: "num"} : num)], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'num',
            value: d[0].value,
            ...(continuedBreak)&&{ damage: true }
        }}
        },
    {"name": "val_num_frac", "symbols": [(lexer.has("frac") ? {type: "frac"} : frac)], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'num.frac',
            value: d[0].value,
            ...(continuedBreak)&&{ damage: true }
        }}
        },
    {"name": "val_num_plhd$subexpression$1", "symbols": [(lexer.has("n") ? {type: "n"} : n)]},
    {"name": "val_num_plhd$subexpression$1", "symbols": [(lexer.has("N") ? {type: "N"} : N)]},
    {"name": "val_num_plhd", "symbols": ["val_num_plhd$subexpression$1"], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'num.uncrt',
            value: 'N',
            ...(continuedBreak)&&{ damage: true }
        }}
        },
    {"name": "val_num_plhd_plus", "symbols": [(lexer.has("num_plhd_plus") ? {type: "num_plhd_plus"} : num_plhd_plus)], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'num.uncrt.plus',
            value: d[0].value,
            ...(continuedBreak)&&{ damage: true }
        }}
        },
    {"name": "value_punct", "symbols": ["punct"]},
    {"name": "value_punct", "symbols": ["punct_s"]},
    {"name": "value_punct", "symbols": ["punct_q"]},
    {"name": "punct", "symbols": [(lexer.has("punct") ? {type: "punct"} : punct)], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'punct',
            value: d[0].value,
            ...(continuedBreak)&&{ damage: true }
        }}
        },
    {"name": "punct_s", "symbols": [(lexer.has("punct_s") ? {type: "punct_s"} : punct_s)], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'punct.s',
            value: d[0].value,
            ...(continuedBreak)&&{ damage: true }
        }}
        },
    {"name": "punct_q", "symbols": [(lexer.has("punct_q") ? {type: "punct_q"} : punct_q)], "postprocess":  
        d => { return {
            _class: 'chr',
            type: 'punct.q',
            value: d[0].value,
            ...(continuedBreak)&&{ damage: true }
        }}
        },
    {"name": "sList_ref$subexpression$1", "symbols": ["sList_ref_PC"]},
    {"name": "sList_ref$subexpression$1", "symbols": ["sList_ref_syllabary"]},
    {"name": "sList_ref$subexpression$1", "symbols": ["sList_ref_PE"]},
    {"name": "sList_ref", "symbols": ["sList_ref$subexpression$1"]},
    {"name": "sList_ref_syllabary", "symbols": [(lexer.has("SL_name") ? {type: "SL_name"} : SL_name), (lexer.has("SL_number") ? {type: "SL_number"} : SL_number)], "postprocess":  
            d => {
            d = flatAll(d);
            return {
                _class: 'chr',
                type: 'sListRef',
                value: d[0].value,
                index: d[1].value,
                ...(continuedBreak)&&{ damage: true }
            }
        }
        },
    {"name": "sList_ref_PC$subexpression$1", "symbols": [(lexer.has("SL_PC") ? {type: "SL_PC"} : SL_PC)]},
    {"name": "sList_ref_PC$subexpression$1", "symbols": [(lexer.has("SL_PC_s") ? {type: "SL_PC_s"} : SL_PC_s)]},
    {"name": "sList_ref_PC", "symbols": ["sList_ref_PC$subexpression$1"], "postprocess":  
            d => {
            d = flatAll(d);
            return {
                _class: 'chr',
                type: 'sListRef.protoCuneiform',
                value: 'N',
                index: d[0].value.replace('N', ''),
                ...(continuedBreak)&&{ damage: true }
            }
        }
        },
    {"name": "sList_ref_PE$subexpression$1", "symbols": [(lexer.has("SL_PE") ? {type: "SL_PE"} : SL_PE)]},
    {"name": "sList_ref_PE$subexpression$1", "symbols": [(lexer.has("SL_PE_s") ? {type: "SL_PE_s"} : SL_PE_s)]},
    {"name": "sList_ref_PE", "symbols": ["sList_ref_PE$subexpression$1"], "postprocess":  
            d => {
            d = flatAll(d);
            return {
                _class: 'chr',
                type: 'sListRef.protoElamite',
                value: 'M',
                index: d[0].value.replace('M', ''),
                ...(continuedBreak)&&{ damage: true }
            }
        }
        },
    {"name": "index", "symbols": ["index_num"]},
    {"name": "index", "symbols": ["index_x"]},
    {"name": "index_x$subexpression$1", "symbols": [(lexer.has("x_s") ? {type: "x_s"} : x_s)]},
    {"name": "index_x$subexpression$1", "symbols": [(lexer.has("xL_s") ? {type: "xL_s"} : xL_s)]},
    {"name": "index_x$subexpression$1", "symbols": [(lexer.has("x_u") ? {type: "x_u"} : x_u)]},
    {"name": "index_x", "symbols": ["index_x$subexpression$1"], "postprocess":  
        d => {return {index: 'x'}} 
        },
    {"name": "index_num", "symbols": [(lexer.has("num_s") ? {type: "num_s"} : num_s)], "postprocess": d => {return {index: escapeSNum(d[0].value)}}},
    {"name": "index_num", "symbols": [(lexer.has("num") ? {type: "num"} : num)], "postprocess": d => {return {index: d[0].value}}},
    {"name": "tail$ebnf$1", "symbols": ["mod"]},
    {"name": "tail$ebnf$1", "symbols": ["tail$ebnf$1", "mod"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail$ebnf$2", "symbols": []},
    {"name": "tail$ebnf$2", "symbols": ["tail$ebnf$2", "flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail$ebnf$3", "symbols": ["ref"], "postprocess": id},
    {"name": "tail$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail$ebnf$4", "symbols": ["brk"], "postprocess": id},
    {"name": "tail$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail", "symbols": ["tail$ebnf$1", "tail$ebnf$2", "tail$ebnf$3", "tail$ebnf$4"]},
    {"name": "tail$ebnf$5", "symbols": []},
    {"name": "tail$ebnf$5", "symbols": ["tail$ebnf$5", "mod"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail$ebnf$6", "symbols": ["flag"]},
    {"name": "tail$ebnf$6", "symbols": ["tail$ebnf$6", "flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail$ebnf$7", "symbols": ["ref"], "postprocess": id},
    {"name": "tail$ebnf$7", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail$ebnf$8", "symbols": ["brk"], "postprocess": id},
    {"name": "tail$ebnf$8", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail", "symbols": ["tail$ebnf$5", "tail$ebnf$6", "tail$ebnf$7", "tail$ebnf$8"]},
    {"name": "tail$ebnf$9", "symbols": []},
    {"name": "tail$ebnf$9", "symbols": ["tail$ebnf$9", "mod"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail$ebnf$10", "symbols": []},
    {"name": "tail$ebnf$10", "symbols": ["tail$ebnf$10", "flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail$ebnf$11", "symbols": ["brk"], "postprocess": id},
    {"name": "tail$ebnf$11", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail", "symbols": ["tail$ebnf$9", "tail$ebnf$10", "ref", "tail$ebnf$11"]},
    {"name": "tail$ebnf$12", "symbols": []},
    {"name": "tail$ebnf$12", "symbols": ["tail$ebnf$12", "mod"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail$ebnf$13", "symbols": []},
    {"name": "tail$ebnf$13", "symbols": ["tail$ebnf$13", "flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail$ebnf$14", "symbols": ["ref"], "postprocess": id},
    {"name": "tail$ebnf$14", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail", "symbols": ["tail$ebnf$12", "tail$ebnf$13", "tail$ebnf$14", "brk"]},
    {"name": "tail$ebnf$15", "symbols": []},
    {"name": "tail$ebnf$15", "symbols": ["tail$ebnf$15", "mod"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail$ebnf$16", "symbols": ["ref"], "postprocess": id},
    {"name": "tail$ebnf$16", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail$ebnf$17", "symbols": ["brk"], "postprocess": id},
    {"name": "tail$ebnf$17", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail$ebnf$18", "symbols": ["flag"]},
    {"name": "tail$ebnf$18", "symbols": ["tail$ebnf$18", "flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail", "symbols": ["tail$ebnf$15", "tail$ebnf$16", "tail$ebnf$17", "tail$ebnf$18"]},
    {"name": "tail$ebnf$19", "symbols": ["brk"], "postprocess": id},
    {"name": "tail$ebnf$19", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail$ebnf$20", "symbols": ["flag"], "postprocess": id},
    {"name": "tail$ebnf$20", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail", "symbols": ["ref", "mod", "tail$ebnf$19", "tail$ebnf$20"]},
    {"name": "tail_GDL$ebnf$1", "symbols": ["mod"]},
    {"name": "tail_GDL$ebnf$1", "symbols": ["tail_GDL$ebnf$1", "mod"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail_GDL$ebnf$2", "symbols": []},
    {"name": "tail_GDL$ebnf$2", "symbols": ["tail_GDL$ebnf$2", "flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail_GDL$ebnf$3", "symbols": ["ref"], "postprocess": id},
    {"name": "tail_GDL$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail_GDL", "symbols": ["tail_GDL$ebnf$1", "tail_GDL$ebnf$2", "tail_GDL$ebnf$3"]},
    {"name": "tail_GDL$ebnf$4", "symbols": []},
    {"name": "tail_GDL$ebnf$4", "symbols": ["tail_GDL$ebnf$4", "mod"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail_GDL$ebnf$5", "symbols": ["flag"]},
    {"name": "tail_GDL$ebnf$5", "symbols": ["tail_GDL$ebnf$5", "flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail_GDL$ebnf$6", "symbols": ["ref"], "postprocess": id},
    {"name": "tail_GDL$ebnf$6", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tail_GDL", "symbols": ["tail_GDL$ebnf$4", "tail_GDL$ebnf$5", "tail_GDL$ebnf$6"]},
    {"name": "tail_GDL$ebnf$7", "symbols": []},
    {"name": "tail_GDL$ebnf$7", "symbols": ["tail_GDL$ebnf$7", "mod"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail_GDL$ebnf$8", "symbols": []},
    {"name": "tail_GDL$ebnf$8", "symbols": ["tail_GDL$ebnf$8", "flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail_GDL", "symbols": ["tail_GDL$ebnf$7", "tail_GDL$ebnf$8", "ref"]},
    {"name": "tail_GDL$ebnf$9", "symbols": []},
    {"name": "tail_GDL$ebnf$9", "symbols": ["tail_GDL$ebnf$9", "flag"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tail_GDL", "symbols": ["ref", "mod", "tail_GDL$ebnf$9"]},
    {"name": "op", "symbols": ["opBeside"]},
    {"name": "op", "symbols": ["opJoining"]},
    {"name": "op", "symbols": ["opContaining"]},
    {"name": "op", "symbols": ["opContainingX"]},
    {"name": "op", "symbols": ["opAbove"]},
    {"name": "op", "symbols": ["opCrossing"]},
    {"name": "op", "symbols": ["opOpposing"]},
    {"name": "op", "symbols": ["opReversed"]},
    {"name": "op", "symbols": ["opAlternative"]},
    {"name": "opBeside$subexpression$1", "symbols": [(lexer.has("opBeside") ? {type: "opBeside"} : opBeside)]},
    {"name": "opBeside", "symbols": ["opBeside$subexpression$1"], "postprocess":  
        d => { return { _class: 'GDLOperator', type: 'beside', value: '.' }} 
        },
    {"name": "opJoining", "symbols": [(lexer.has("opJoining") ? {type: "opJoining"} : opJoining)], "postprocess":  
        d => { return { _class: 'GDLOperator', type: 'joining', value: '+' }} 
        },
    {"name": "opContaining$subexpression$1", "symbols": [(lexer.has("opContaining") ? {type: "opContaining"} : opContaining)]},
    {"name": "opContaining$subexpression$1", "symbols": [(lexer.has("x_s") ? {type: "x_s"} : x_s)]},
    {"name": "opContaining", "symbols": ["opContaining$subexpression$1"], "postprocess":  
        d => { return { _class: 'GDLOperator', type: 'containing', value: '×' }} 
        },
    {"name": "opContainingX", "symbols": [(lexer.has("mod_xX") ? {type: "mod_xX"} : mod_xX)], "postprocess":  
        d => { return [
         { _class: 'GDLOperator', type: 'containing', value: '×' },
         { _class: 'chr', type: 'uncrt.large', value: 'X'}
        ]}
        },
    {"name": "opAbove", "symbols": [(lexer.has("opAbove") ? {type: "opAbove"} : opAbove)], "postprocess":  
        d => { return { _class: 'GDLOperator', type: 'above', value: '&' }} 
        },
    {"name": "opCrossing", "symbols": [(lexer.has("opCrossing") ? {type: "opCrossing"} : opCrossing)], "postprocess":  
        d => { return { _class: 'GDLOperator', type: 'crossing', value: '%' }} 
        },
    {"name": "opOpposing", "symbols": [(lexer.has("opOpposing") ? {type: "opOpposing"} : opOpposing)], "postprocess":  
        d => { return { _class: 'GDLOperator', type: 'opposing', value: '@' }} 
        },
    {"name": "opReversed", "symbols": [(lexer.has("opReversed") ? {type: "opReversed"} : opReversed)], "postprocess":  
        d => { return { _class: 'GDLOperator', type: 'reversed', value: ':' }} 
        },
    {"name": "opAlternative", "symbols": [(lexer.has("opAlternative") ? {type: "opAlternative"} : opAlternative)], "postprocess":  
        d => { return { _class: 'GDLOperator', type: 'alternative', value: '/' }} 
        },
    {"name": "opRepeat$subexpression$1", "symbols": [(lexer.has("opContaining") ? {type: "opContaining"} : opContaining)]},
    {"name": "opRepeat$subexpression$1", "symbols": [(lexer.has("x_s") ? {type: "x_s"} : x_s)]},
    {"name": "opRepeat", "symbols": ["opRepeat$subexpression$1", (lexer.has("num") ? {type: "num"} : num)], "postprocess":  
        d => { return { 
            _class: 'GDLOperator',
            type: 'repeat',
            value: data[1].value
        }} 
        },
    {"name": "mod", "symbols": ["modif"]},
    {"name": "mod", "symbols": ["mod_rotate"]},
    {"name": "mod", "symbols": ["allogr"]},
    {"name": "allogr", "symbols": [(lexer.has("allogr") ? {type: "allogr"} : allogr)], "postprocess": 
            d => {
            return {
                _class: 'GDLModifier',
                type: 'allogr',
                value: d[0].value.replace('~', ''),
            };
        }
        },
    {"name": "mod_rotate", "symbols": [(lexer.has("mod_rotate") ? {type: "mod_rotate"} : mod_rotate)], "postprocess": 
            d => {
            return {
                _class: 'GDLModifier',
                type: 'rotate',
                value: d[0].value.replace('@', ''),
            }
        }
        },
    {"name": "modif", "symbols": [(lexer.has("mod") ? {type: "mod"} : mod)], "postprocess": 
            d => {
            let value = d[0].value.replace('@', '');
            return value.split().map( v => {
                return {
                    _class: 'GDLModifier',
                    type: modNamed[v],
                    value: v,
                }
            })
        }
        },
    {"name": "WS$ebnf$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "WS$ebnf$1", "symbols": ["WS$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "WS", "symbols": ["WS$ebnf$1"], "postprocess": () => null},
    {"name": "prtO", "symbols": [(lexer.has("prtO") ? {type: "prtO"} : prtO)], "postprocess": () => null},
    {"name": "prtC", "symbols": [(lexer.has("prtC") ? {type: "prtC"} : prtC)], "postprocess": () => null},
    {"name": "prtCa", "symbols": [(lexer.has("prtCa") ? {type: "prtCa"} : prtCa)], "postprocess": () => null},
    {"name": "glossO", "symbols": [(lexer.has("glossO") ? {type: "glossO"} : glossO)], "postprocess": () => null},
    {"name": "detO", "symbols": [(lexer.has("detO") ? {type: "detO"} : detO)], "postprocess": () => null},
    {"name": "gdC", "symbols": [(lexer.has("gdC") ? {type: "gdC"} : gdC)], "postprocess": () => null},
    {"name": "div", "symbols": [(lexer.has("div") ? {type: "div"} : div)], "postprocess": () => null},
    {"name": "div", "symbols": [(lexer.has("div_special") ? {type: "div_special"} : div_special)], "postprocess": d => {return {'divider': d[0].value}}},
    {"name": "flag", "symbols": [(lexer.has("flag") ? {type: "flag"} : flag)], "postprocess": d => {return {type: 'flag', 'children': d[0].value}}},
    {"name": "brk", "symbols": [(lexer.has("brk") ? {type: "brk"} : brk)], "postprocess": d => {return { type: 'brk' }}},
    {"name": "brkO", "symbols": [(lexer.has("brkO") ? {type: "brkO"} : brkO)], "postprocess":  d => {
        continuedBreak = true;
        return;} 
        },
    {"name": "brkC", "symbols": [(lexer.has("brkC") ? {type: "brkC"} : brkC)], "postprocess":  d => {
        continuedBreak = false;
        return;} 
        },
    {"name": "lingGlO", "symbols": [(lexer.has("lingGlO") ? {type: "lingGlO"} : lingGlO)], "postprocess": d => {return {type: 'lingGlO', 'children': d[0].value}}},
    {"name": "lingGlC", "symbols": [(lexer.has("lingGlC") ? {type: "lingGlC"} : lingGlC)], "postprocess": d => {return {type: 'lingGlС', 'children': d[0].value}}},
    {"name": "DocGlO", "symbols": [(lexer.has("DocGlO") ? {type: "DocGlO"} : DocGlO)], "postprocess": d => {return {type: 'DocGlO', 'children': d[0].value}}},
    {"name": "DocGlC", "symbols": [(lexer.has("DocGlC") ? {type: "DocGlC"} : DocGlC)], "postprocess": d => {return {type: 'DocGlС', 'children': d[0].value}}},
    {"name": "PrsExcO", "symbols": [(lexer.has("PrsExcO") ? {type: "PrsExcO"} : PrsExcO)], "postprocess": d => {return {type: 'PrsExcO', 'children': d[0].value}}},
    {"name": "PrsExcC", "symbols": [(lexer.has("PrsExcC") ? {type: "PrsExcC"} : PrsExcC)], "postprocess": d => {return {type: 'PrsExcС', 'children': d[0].value}}},
    {"name": "ElpO", "symbols": [(lexer.has("ElpO") ? {type: "ElpO"} : ElpO)], "postprocess": d => {return {type: 'ElpO', 'children': d[0].value}}},
    {"name": "ElpC", "symbols": [(lexer.has("ElpC") ? {type: "ElpC"} : ElpC)], "postprocess": d => {return {type: 'ElpС', 'children': d[0].value}}},
    {"name": "PrsMisO", "symbols": [(lexer.has("PrsMisO") ? {type: "PrsMisO"} : PrsMisO)], "postprocess": d => {return {type: 'PrsMisO', 'children': d[0].value}}},
    {"name": "PrsMisC", "symbols": [(lexer.has("PrsMisC") ? {type: "PrsMisC"} : PrsMisC)], "postprocess": d => {return {type: 'PrsMisС', 'children': d[0].value}}},
    {"name": "prtGDL", "symbols": [(lexer.has("prtGDL") ? {type: "prtGDL"} : prtGDL)], "postprocess": () => null},
    {"name": "log_", "symbols": [(lexer.has("log_") ? {type: "log_"} : log_)], "postprocess": () => null},
    {"name": "NL", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": () => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
