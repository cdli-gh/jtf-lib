# See:
# http://oracc.ub.uni-muenchen.de/doc/help/editinginatf/primer/inlinetutorial/index.html
# http://oracc.museum.upenn.edu/ns/gdl/1.0/index.html
#
# Compile with 'nearleyc ATFtextGrammar.ne -o ATFtextGrammar.js'
#
#===/ import & define lexer /=================================================
@{% 
    const lexer = require('./ATFtextTokenizer.js').lexer;
%}

@lexer lexer

#===/ import postprocessors /=================================================
@{%
    const flatAll = require('./postprocessors.js').flatAll;
    const escapeSNum = require('./postprocessors.js').escapeSNum;
%}

@{% 
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
%}

#---/ Break formatter /-------------------------------------------------------
@{%
    let continuedBreak = false;
    let continuedLogogram = false; //ToDo: add function, as with break ?
    let continuedGloss = false; //ToDo: add function / wrap in class ?
%}
#===/ Grammar begins here --> /===============================================

#===/ basic structure /=======================================================

main -> (main_chain | main_chain_non_linear):+ NL
{% d => {
    d = flatAll( d );
    d = makeFields( d );
    return { inline: d };
} 
%}

main_chain_non_linear -> prtO INLINE_CORE (WS INLINE_CORE):* prtCa fSep:* WS:+
main_chain -> INLINE_CORE:? fSep:* WS:+

INLINE_CORE -> inlineComment | SEQUENCE

inlineComment -> %inlineComment
{% d => {
    return { 
    _class: 'inlineComment',
    value: d.value.replace(/\(\$ | \$\)/g, ''),
    }}
%}

SEQUENCE -> (SEQ_SHORT | SEQ_LONG | SEQ_DET)
{% 
d => {
    d = flatAll(d);
    return d;
}
%}

SEQ_DET -> DET:+
{% 
    d => {
        return {_class: 'sequence', type: 'incomplete', children: flatAll(d)};
    }
%}

SEQ_SHORT -> SIGN
{% 
    d => {
        return {_class: 'sequence', type: 'short', children: flatAll(d)};
    }
%}

SEQ_LONG -> (SEQ_CORE div):+ SEQ_CORE
{% 
    d => {
        return {_class: 'sequence', type: 'long', children: flatAll(d)};
    }
%}

SEQ_CORE -> SEQ_GLOSS | SEQ_DET | SIGN

SEQ_GLOSS -> SG_S | S_GS | GS | SG

GS -> GLOSS (SIGN | SEQ_DET )
SG -> (SIGN | SEQ_DET ) GLOSS
SG_S -> GS div SIGN
S_GS -> (SIGN | SEQ_DET ) div GS

SEQ_DET -> SD_S | S_DS | DS | SD | SDS

DS -> DET:+ SIGN
SD -> SIGN DET:+
SDS -> DET:+ SIGN DET:+
SD_S -> SD div SIGN
S_DS -> SIGN div DS

SIGN -> SIGN_PRE:? SIGN_CORE SIGN_POST:?

# ToDO: figure this out, log_ sometimes causes a memory collapse ?

SIGN_PRE -> (log_ | PRE_BRC | log_ PRE_BRC | PRE_BRC log_)

SIGN_POST -> (log_ | POST_BRC | log_ POST_BRC | POST_BRC log_)

PRE_BRC -> (brkO | lingGlO | DocGlO | PrsExcO | ElpO | PrsMisO):+

POST_BRC -> (brkC | lingGlC | DocGlC | PrsExcC | ElpC | PrsMisC):+

# ToDo:
# Sort out undefined and make sub-cathegories:
# * undefined logograms (such as %xL_s / %xL_l)
# * logogram with known type & uncert. / unkn. reading (such as CL & CL_CDLI)

DET -> SIGN_PRE:? detO DET_CHAIN gdC SIGN_POST:?

DET_CHAIN -> DET_SIGN (div DET_SIGN):*

DET_SIGN -> SIGN_PRE:? SIGN_CORE SIGN_POST:?
{%
d => {
    d = flatAll(d)
    d.forEach( c => { 
        if ( c._class='chr' ) {
            c.type = 'det';
        }
    })
    return d;
}
%}

GLOSS -> SIGN_PRE:? glossO div:? GLOSS_CHAIN gdC SIGN_POST:?
{% d => { 
    return { _class: 'gloss', children: d} }
%}

GLOSS_CHAIN -> GLOSS_SIGN (div GLOSS_SIGN):*
GLOSS_SIGN -> SIGN_PRE:? SIGN_CORE SIGN_POST:?

# ToDO: 
# * Add script gloss: mu-un-šum₂{%1 szu} {%\d }
#     http://oracc.museum.upenn.edu/ns/gdl/1.0/index.html#Scripts
#     %ScrO %gdC 
# * add ling. glosses
# * add doc. glosses


#---/ Fields /----------------------------------------------------------------

fSep -> 
      followSV 
    | followPR 
    #| followSN #! Misinterprets ambig. cases like "1(N01) , |LAGAB~axZATU753|"
    | followEq 
    | followWP 
    | followCS 
    | fieldSep 
    | columnSep

followSV -> %followSV
{% () => { return {fieldSeparator: 'signValue'}} %}

followPR -> %followPR
{% () => { return {fieldSeparator: 'signPronunciation'}} %}

#! Misinterprets cases like "1(N01) , |LAGAB~axZATU753|"
#followSN -> %followSN
#{% () => { return {fieldSeparator: 'signName'}} %}

followEq -> %followEq
{% () => { return {fieldSeparator: 'equivalent'}} %}

followWP -> %followWP
{% () => { return {fieldSeparator: 'wordOrPhrase'}} %}

followCS -> %followCS
{% () => { return {fieldSeparator: 'containedSigns'}} %}

fieldSep -> %fieldSep
{% () => { return {fieldSeparator: 'field'}} %}

columnSep -> %columnSep
{% () => { return {fieldSeparator: 'column.inline'}} %}

#===/ Sign structure /========================================================
#---/ Core sign element /-----------------------------------------------------

@{%
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

%}

SIGN_CORE -> ( anyValue | GDL_object ) tail:?
{%
    d => { 
      return makeSign(d)
    }
%}

#---/ GDL /-----------------------------------------------------------

GDL_object -> prtGDL GDL_element prtGDL
{%
d => {
    d = flatAll(d);
    return { 
        _class: 'chr',
        type: 'GDLObject',
        children: d,
        ...(continuedBreak)&&{ damage: true }
    };
}
%}

GDL_group -> prtO GDL_chain prtC tail_GDL:?
{%
    d => { 
        let chr = {
            _class: 'chr',
            type: 'GDLGroup',
            children: flatAll(d[1]),
        };
        return [chr, d[3]];
    }
%}

GDL_chain -> GDL_element ( op GDL_element | opContainingX ):+

GDL_element -> opRepeat:? ( anyValue tail_GDL:? | GDL_group | GDL_chain )
{%
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
%}

#---/ Reference (& unit) /----------------------------------------------------

ref -> prtO ( GDL_object | anyValue tail_GDL:? ) prtC
{%
    d => {
        d = flatAll(d);
        return { 
          reference: (d[0].type!=='GDLObject') 
            ? makeSign(d)[0]
            : d[0] 
        };
    }
%}

#---/ Value /-----------------------------------------------------------------

anyValue ->
    ( value 
    | VALUE 
    | value_num 
    | value_punct 
    | sList_ref 
    | brkElp )
{%
    d => {
        return makeBreaks( flatAll(d)[0] );
    }
%}

value -> val | c_universal | x_val
VALUE -> VAL | VALL | valL | X_val

@{%
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
%}

#---/ Text value: indexed /---------------------------------------------------

val -> %val index:?
{% 
    d => { 
        d = flatAll(d);
        return {
            _class: 'chr',
            type: 'syl',
            value: d[0].value,
            ...(d[1]) && d[1], //index
    }}
%}

VAL -> %VAL index:?
{% 
    d => { 
        d = flatAll(d);
        return {
            _class: 'chr',
            value: d[0].value,
            ...(d[1]) && d[1], //index
    }}
%}

valL -> %valL index:?
{% 
    d => {
        d = flatAll(d);
        return {
            _class: 'chr',
            type: 'log',
            value: d[0].value,
            ...(d[1]) && d[1], //index
    }}
%}

VALL -> %VALL index:?
{% 
    d => {
        d = flatAll(d);
        return {
            _class: 'chr',
            type: 'log',
            value: d[0].value,
            ...(d[1]) && d[1], //index
    }}
%}

## ToDO: Add value break postprocessor to define position within sign

val_brk -> brkO | brkC

#---/ Text value: non-indexed / special /-------------------------------------

c_universal -> %c_universal
{% 
    d => { return {
        _class: 'chr',
        value: d[0].value
    }}
%}

x_val -> ( %x_s | %xL_s )
{% 
    d => { return {
        _class: 'chr',
        type: 'uncrt.small',
        value: 'x'
    }}
%}

X_val -> ( %x_l | %xL_l )
{% 
    d => { return {
        _class: 'chr',
        type: 'uncrt.large',
        value: 'X'
    }}
%}

brkElp -> %brkElp
# ToDo: Ensure that this works. See tokenizer.
{% 
    d => { return {
        _class: 'chr',
        type: 'broken.gap',
        value: '…',
        damage: true,
    }}
%}

#---/ Numeric value /---------------------------------------------------------

value_num ->
      val_num 
    | val_num_frac
    | val_num_plhd
    | val_num_plhd_plus

val_num -> %num
{% 
    d => { return {
        _class: 'chr',
        type: 'num',
        value: d[0].value,
        ...(continuedBreak)&&{ damage: true }
    }}
%}

val_num_frac -> %frac
{% 
    d => { return {
        _class: 'chr',
        type: 'num.frac',
        value: d[0].value,
        ...(continuedBreak)&&{ damage: true }
    }}
%}

val_num_plhd -> (%n | %N )
{% 
    d => { return {
        _class: 'chr',
        type: 'num.uncrt',
        value: 'N',
        ...(continuedBreak)&&{ damage: true }
    }}
%}

val_num_plhd_plus -> %num_plhd_plus
{% 
    d => { return {
        _class: 'chr',
        type: 'num.uncrt.plus',
        value: d[0].value,
        ...(continuedBreak)&&{ damage: true }
    }}
%}

#---/ Punctuation value /-----------------------------------------------------

# Note gana2 and pi as punct: *GANA₂ or *(GANA₂) , *PI or *(PI)
# http://oracc.ub.uni-muenchen.de/doc/help/editinginatf/metrology/index.html

value_punct -> punct | punct_s | punct_q

punct -> %punct
{% 
    d => { return {
        _class: 'chr',
        type: 'punct',
        value: d[0].value,
        ...(continuedBreak)&&{ damage: true }
    }}
%}

punct_s -> %punct_s
{% 
    d => { return {
        _class: 'chr',
        type: 'punct.s',
        value: d[0].value,
        ...(continuedBreak)&&{ damage: true }
    }}
%}

punct_q -> %punct_q
{% 
    d => { return {
        _class: 'chr',
        type: 'punct.q',
        value: d[0].value,
        ...(continuedBreak)&&{ damage: true }
    }}
%}

#---/ Signlist reference value /----------------------------------------------

sList_ref -> (sList_ref_PC | sList_ref_syllabary | sList_ref_PE)

sList_ref_syllabary -> %SL_name %SL_number
{% 
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
%}

sList_ref_PC -> (%SL_PC | %SL_PC_s)
{% 
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
%}

sList_ref_PE -> (%SL_PE | %SL_PE_s)
{% 
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
%}

#---/ Index /-----------------------------------------------------------------

index -> index_num | index_x

index_x ->    (%x_s | %xL_s | %x_u ) 
{% 
    d => {return {index: 'x'}} 
%}

index_num -> 
        %num_s {% d => {return {index: escapeSNum(d[0].value)}} %}
    | %num {% d => {return {index: d[0].value}} %}


#---/ Char tail /-------------------------------------------------------------

tail ->    
        mod:+ flag:* ref:? brk:?
    | mod:* flag:+ ref:? brk:?
    | mod:* flag:* ref brk:?
    | mod:* flag:* ref:? brk
    | mod:* ref:? brk:? flag:+
    | ref mod brk:? flag:?
    
tail_GDL ->
        mod:+ flag:* ref:?
    | mod:* flag:+ ref:?
    | mod:* flag:* ref
    | ref mod flag:* 

#---/ Operators /-------------------------------------------------------------

op -> 
    opBeside 
    | opJoining 
    | opContaining 
    | opContainingX
    | opAbove 
    | opCrossing 
    | opOpposing
    | opReversed
    | opAlternative

opBeside -> ( %opBeside ) 
{% 
    d => { return { _class: 'GDLOperator', type: 'beside', value: '.' }} 
%}

opJoining -> %opJoining 
{% 
    d => { return { _class: 'GDLOperator', type: 'joining', value: '+' }} 
%}

opContaining -> ( %opContaining | %x_s ) 
{% 
    d => { return { _class: 'GDLOperator', type: 'containing', value: '×' }} 
%}

opContainingX -> %mod_xX 
# Shortcut for containing X i.e. ×X.
{% 
    d => { return [
     { _class: 'GDLOperator', type: 'containing', value: '×' },
     { _class: 'chr', type: 'uncrt.large', value: 'X'}
    ]}
%}

opAbove -> %opAbove 
{% 
    d => { return { _class: 'GDLOperator', type: 'above', value: '&' }} 
%}

opCrossing -> %opCrossing 
{% 
    d => { return { _class: 'GDLOperator', type: 'crossing', value: '%' }} 
%}

opOpposing -> %opOpposing 
{% 
    d => { return { _class: 'GDLOperator', type: 'opposing', value: '@' }} 
%}

opReversed -> %opReversed 
{% 
    d => { return { _class: 'GDLOperator', type: 'reversed', value: ':' }} 
%}

opAlternative -> %opAlternative 
{% 
    d => { return { _class: 'GDLOperator', type: 'alternative', value: '/' }} 
%}

# Note: Should be placed before sign, unlike other operators.
opRepeat -> ( %opContaining | %x_s ) %num
{% 
    d => { return { 
        _class: 'GDLOperator',
        type: 'repeat',
        value: data[1].value
    }} 
%}

#---/ Modifiers /-------------------------------------------------------------

mod ->
        modif
    | mod_rotate
    | allogr

allogr -> %allogr
{%
    d => {
    return {
        _class: 'GDLModifier',
        type: 'allogr',
        value: d[0].value.replace('~', ''),
    };
}
%}

mod_rotate -> %mod_rotate
{%
    d => {
    return {
        _class: 'GDLModifier',
        type: 'rotate',
        value: d[0].value.replace('@', ''),
    }
}
%}

@{%
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
%}

modif -> %mod
{%
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
%}

#---/ Basic lexer variables /-------------------------------------------------

WS -> %WS:+ 
{% () => null %}

prtO -> %prtO
{% () => null %}

prtC -> %prtC
{% () => null %}

prtCa -> %prtCa
{% () => null %}

glossO -> %glossO
{% () => null %}

detO -> %detO
{% () => null %}

gdC -> %gdC #closes both det and gloss
{% () => null %}

div -> 
      %div {% () => null %}
    | %div_special {% d => {return {'divider': d[0].value}} %}

flag -> %flag
{% d => {return {type: 'flag', 'children': d[0].value}} %}

brk -> %brk
{% d => {return { type: 'brk' }} %}

brkO -> %brkO
{% d => {
    continuedBreak = true;
    return;} 
%}

brkC -> %brkC
{% d => {
    continuedBreak = false;
    return;} 
%}

lingGlO -> %lingGlO #'{{'
{% d => {return {type: 'lingGlO', 'children': d[0].value}} %}

lingGlC -> %lingGlC #'}}'
{% d => {return {type: 'lingGlС', 'children': d[0].value}} %}

DocGlO -> %DocGlO #'{('
{% d => {return {type: 'DocGlO', 'children': d[0].value}} %}

DocGlC -> %DocGlC #'})'
{% d => {return {type: 'DocGlС', 'children': d[0].value}} %}
    
PrsExcO -> %PrsExcO #'>>'
{% d => {return {type: 'PrsExcO', 'children': d[0].value}} %}

PrsExcC -> %PrsExcC #'<<'
{% d => {return {type: 'PrsExcС', 'children': d[0].value}} %}
    
ElpO -> %ElpO #'<('
{% d => {return {type: 'ElpO', 'children': d[0].value}} %}

ElpC -> %ElpC #')>'
{% d => {return {type: 'ElpС', 'children': d[0].value}} %}
    
PrsMisO -> %PrsMisO #'<'
{% d => {return {type: 'PrsMisO', 'children': d[0].value}} %}

PrsMisC -> %PrsMisC #'>'
{% d => {return {type: 'PrsMisС', 'children': d[0].value}} %}

prtGDL -> %prtGDL
{% () => null %}

log_ -> %log_
{% () => null %}

NL -> %NL
{% () => null %}