/*---/ Formatters for JTF /-------------------------------------------------*/
// 
// Use to format and correct JTF data.
//
// IMPORTANT: Add here modifications to the data.
//
// * Should NOT DO changes to the data structure itself other than adding 
//     attributes from data templates.
// * Should NOT DO any additional parsing -- use ATF2JTF for that.
//
//

/*---/ Imports /--*/

const D = require('../Data/Data.js');
const SL = require('jtf-signlist/index');

/*---/ JTF Formatter /--*/

let warnings = [];

const JTFFormatter = function( JTFobj, i=0, parentID=null ){
  // Universal JTF formatter entry point.
  if ( JTFobj.meta && JTFobj.objects){
    warnings = [];
    // ToDo: insert here metadata processor, if needed
    JTFobj.objects = JTFobj.objects.map( (o, i) => {
      o.id = `${JTFobj.meta.p_number}__${i}`;
      return formatChildren(o) 
    });
    if (warnings.length>0){ JTFobj.warnings = [...warnings] }
  } else {
    JTFobj.id = (parentID) ? `${parentID}_${i}` : `${i}`;
    if (JTFobj.errors) {
      //console.log('Add error handling:', JTFobj);
    } else if (!formattersByClass[JTFobj._class]) {
      JTFobj = handleUndefinedClass(JTFobj);
    } else {
      JTFobj = formattersByClass[JTFobj._class]( JTFobj )
      JTFobj = formatChildren(JTFobj);
    };
  };
  return JTFobj;
};

const handleUndefinedClass = function(JTFobj){
  //
/*   console.log(
    'JTF formatter WARNING: skipped object with undefined _class\n',
    JTFobj
  ); */
  pushWarning({
    agent: 'JTFFormatter',
    type: 'Unknown JTF _class',
    text: 'JTFTree maker WARNING: object with undefined _class',
    action: 'skipped',
    object: JTFobj,
  });
  return JTFobj;
};

const pushWarning = function( warning ){
  //
  warnings.push(warning);
};

const formatChildren = function( object ){
  //
  if (!object.children || !object.children.map) { return object };
  object.children.map(function( c, i ){
    c.parent = object;
    c = JTFFormatter( c, i, object.id );
    delete c.parent;
    return c;
  });
  return object;
};

/*---/ Data /---*/

const containerProps = [
  'id',
  'type',
  'name',
  'children',
];

const contentProps = [
  //'parent', //replace with parent element id for JTFCRUD.Strip(  )
];

const dataObject = {
  '_class': 'object',
  '_props_basic': containerProps,
};

const dataSurface = {
  '_class': 'surface',
  '_props_basic': containerProps,
  //'_props_secondary': contentProps,
};

const dataColumn = {
  '_class': 'column',
  '_props_basic': containerProps,
  //'_props_secondary': contentProps,
};

const dataQLink = {
  // ToDo: add line ref.
  '_class': 'qLink',
  '_props_basic': ['id', 'type', 'QNumber', 'QLine'],
  //'_props_secondary': [],
};

const dataTransl = {
  // ToDo: add line ref.
  '_class': 'transl',
  '_props_basic': ['id', 'type', 'lang', 'value'],
  //'_props_secondary': [],
};

const dataLine = {
  '_class': 'line',
  '_props_basic': containerProps,
  '_props_optional': ['id', 'QLink', 'link'],
  //'_props_secondary': contentProps,
};

const dataRuling = {
  '_class': 'ruling',
  '_props_basic': ['id', 'type', 'name'],
  //'_props_secondary': contentProps,
};

const dataState = {
  '_class': 'state',
  '_props_basic': ['id', 'type', 'extent', 'qualification', 'scope', 'state', 'lacuna'],
  //'_props_secondary': contentProps,
};

const dataSequence = {
  '_class': 'sequence',
  '_props_basic': containerProps,
  //'_props_secondary': contentProps,
};

const dataChr = {
  '_class': 'chr',
  // JTF basic fields.
  '_props_basic': [
    'id',
    'type',
  ],
  '_props_optional': [
    'value',
    'index',
    'separator',
    'unit', // numerals only: chr / GDLGroup objects
    'children', // content of GDL-types chr
    'reference', // non-numeral GDL / signlist references
    'modifiers', // array of GDLModifier objects
    'position', // determinatives only
    'emendation',
    'gloss',
    'exclamation',
    'question',
    'damage',
    'collation',
    'note',
  ],
  '_props_secondary': contentProps,
  // JTF NON-ATF fields.
  '_props_nonATF': [
    'graphics', //{'image': {}},
  ],
  // React only fields.
  '_props_UqNU': [
    'mode', //['edit', 'hint', 'ready', 'incorrect']
    'inputValue',
    'order',
  ],
};

const dataGDLGroup = {
  '_props_basic': [
    'children', // array of chr / GDLGroup objects
  ],
  '_props_optional': [
    'modifiers', // array of GDLModifier objects 
    'operator', // GDLOperator object
  ],
};

const dataGDLOperator = {
  '_props_basic': [
    'type',
    'value',
  ],
};

const dataGDLModifier = {
  '_props_basic': [
    'type',
    'value',
  ],
};

const dataSListRef = {
  '_props_basic': [
    'type',
    'value',
    'index',
  ],
};

const dataField = {
  '_props_basic': [
    'type',
    'children',
  ],
};

const dataComment = {
  '_props_basic': [
    'type',
    'value',
  ],
};

const dataSeal = {
  '_props_basic': [
    'type',
    'name',
  ],
};

const dataInlineComment = {
  '_props_basic': [
    'type',
    'value',
  ],
};

/*---/ Formatter functions /----*/

const formatObject = function( Obj ){
  // JTF Object formatter.
  return Obj;
};

const formatSurface = function( Surface ){
  // JTF Surface formatter.
  return Surface;
};

const formatColumn = function( Column ){
  // JTF Column formatter.
  return Column;
};

const formatRuling = function( Ruling ){
  // JTF Ruling formatter.
  return Ruling;
};

const formatState= function( State ){
  // JTF State formatter.
  return State;
};

const formatComment = function( Comment ){
  // JTF Comment formatter.
  return Comment
};

const formatSeal = function( Seal ){
  // JTF Seal formatter.
  return Seal
};

const formatQLink = function( QLink ){
  // JTF QLink formatter.
  return QLink
};

const formatTransl = function( transl ){
  // JTF transl formatter.
  return transl;
};

const formatLine = function( Line ){
  // JTF Line formatter.
  return Line;
};

const formatSequence = function( Sequence ){
  // JTF Sequence formatter.
  return Sequence;
};

const formatChr = function( Chr, separator=null ){
  // JTF Chr formatter.
  if (separator){
    Chr.separator = separator;
  };
  if (Chr.value){
    Chr.value = D.replace_aliases(Chr.value).toLowerCase();
  };
  ['reference', 'unit'].forEach( fieldName => {
    if ( Chr[fieldName] ){ 
    Chr[fieldName] = formatChr(Chr[fieldName])
  }});
  if (Chr.type==='det'){
    ChrATF = `{${Chr.value}${(Chr.index>1) ? Chr.index : ''}}`
    let ChrEntries = SL.findArticlesByATF(ChrATF).values().next().value;
    Chr.position = (ChrEntries) ? ChrEntries.vDict.position : 'pre';
  };
  if (Chr.children && Chr.children.map){
    Chr.children = Chr.children.map( c => { 
      if (c._class==='chr'){ formatChr( c ) };
      return c;
    });
  };
  // ToDo: 
  // 1. Add jtf-signlist check.
  // 2. Add position for determinatives from jtf-signlist.
  
  return Chr;
};

const formatGDLGroup = function( GDLGroup ){
  // JTF Graph Description Language (GDL) Group formatter.
  return GDLGroup;
};

const formatGDLOperator = function( GDLOperator ){
  // JTF Graph Description Language (GDL) Operator formatter.
  return GDLOperator;
};

const formatGDLModifier = function( GDLModifier ){
  // JTF Graph Description Language (GDL) Modifier formatter.
  return GDLModifier;
};

formatSListRef = function( sListRef ){
  // JTF Signlist reference formatter.
  return sListRef;
}

const formatField = function( Field ){
  // JTF Field formatter.
  return Field;
};

const formatInlineComment = function( inlineComment ){
  // JTF inlineComment formatter.
  return inlineComment;
};


/*---/ Data templates by class /----*/

const DataTemplateByClass = {
  'object': dataObject,
  'surface': dataSurface,
  'column': dataColumn,
  'ruling': dataRuling,
  'state': dataState,
  'seal': dataSeal,
  'comment': dataComment,
  'QLink': dataQLink,
  'transl': dataTransl,
  'line': dataLine,
  'sequence': dataSequence,
  'chr': dataChr,
  'GDLGroup': dataGDLGroup,
  'GDLModifier': dataGDLModifier,
  'GDLOperator': dataGDLOperator,
  'sListRef': dataSListRef,
  'field': dataField,
  'inlineComment': dataInlineComment,
};

/*---/ Formatter function by class /----*/

const formattersByClass = {
  'object': formatObject,
  'surface': formatSurface,
  'column': formatColumn,
  'ruling': formatRuling,
  'state': formatState,
  'seal': formatSeal,
  'comment': formatComment,
  'QLink': formatQLink,
  'transl': formatTransl,
  'line': formatLine,
  'sequence': formatSequence,
  'chr': formatChr,
  'GDLGroup': formatGDLGroup,
  'GDLOperator': formatGDLOperator,
  'GDLModifier': formatGDLModifier,
  'sListRef': formatSListRef,
  'field': formatField,
  'inlineComment': formatInlineComment
};

/*---/ Exports /------------------------------------------------------------*/

exports.JTFFormatter = JTFFormatter;
exports.formatters = formattersByClass;
exports.templates = DataTemplateByClass;
