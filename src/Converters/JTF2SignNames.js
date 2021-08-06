/* 
Functions to turn ATF and JTF into sign name "normalization" string.
*/
const { JSONPath } = require('jsonpath-plus');
const SL = require('jtf-signlist/index');
const { ATF2JTF, ATFLine2JTF } = require('./ATF2JTF.js')

const chr2ATF = ( Chr ) => {
    // Basic jtf chr to ATF converter.
    // ! Ignors damage and other extended information.
    let chrATF = `${Chr.value}${(Chr.index>1) ? Chr.index : ''}`;
    if (Chr.type && Chr.type.includes('num')){
        let unit = (Chr.unit) ? `${chr2ATF(Chr.unit)}` : null;
        chrATF = (unit && Chr.value!=='1')
            ? `${Chr.value}(${unit})` 
            : (unit) ? unit : chrATF ;
    } else if (Chr.type && Chr.type.includes('det')) {
        chrATF = `{${chrATF}}`;
    } else if (Chr.type && Chr.type.includes('GDLObject')) {
        chrATF = GDL2ATF( Chr );
    };
    // IMPORTANT: Add modifiers
    return chrATF;
};

const GDL2ATF = ( Chr ) => {
    //
    return Chr.children.map( c => 
    ( c._class==='GDLOperator' ) 
    ? c.value
    : ( c._class==='chr' ) ? chr2ATF(c) : ''
    ).join('');
};

let path2lines = "$..*[?(@property==='_class' && @ ==='line')]^";
let path2chrs = "$..*[?(@property==='_class' && @ ==='chr')]^";

const JTF2SignNames = ( jtf ) => {
    // Convert JTF to string of "abstract" sign representation 
    // based on sign name. Preserves lines.
    return JSONPath({path: path2lines, json: jtf})
    .map( l => JTFLine2SignNames(l)).join('\n');
};

const JTFLine2SignNames = ( line ) => {
    // Convert single JTF line to string of "abstract" sign representation 
    // based on sign name.
    return JSONPath({path: path2chrs, json: line}).map( Chr => {
        let chrATF = chr2ATF(Chr);
        let ChrEntries = SL.findArticlesByATF(chrATF);
        let value = ChrEntries.values().next().value;
        let article = (value && value.article) ? value.article : null;
        return (article) ? article.name : chrATF;
    }).join(' ').toUpperCase();
};

const ATF2SignNames = ( atf ) => {
    // Shortcut to JTF2SignNames for ATF string.
    return JTF2SignNames( ATF2JTF(atf) );
};

const ATFLine2SignNames = ( atf ) => {
    // Shortcut to JTF2SignNames for ATF line string.
    return JTFLine2SignNames( ATFLine2JTF(atf) );

exports.JTF2SignNames = JTF2SignNames;
exports.JTFLine2SignNames = JTFLine2SignNames;
exports.ATF2SignNames = ATF2SignNames;
exports.ATFLine2SignNames = ATFLine2SignNames;