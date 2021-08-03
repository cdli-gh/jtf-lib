// Convert JTFChar to ATF (ORACC)

separatorByType = function( type1, type2 ) {
	var separator = '';
	if ( type1==='syl' || type2==='syl' ) {
		separator = '-';
	} else if ( 
		['log', 'GDL'].includes(type1)
		&& ['log', 'GDL'].includes(type2) 
	) {
		separator = '.';
	};
	return separator;
};

JTFChar2ATFO = function( JTFChar ){
	var ATFChar = JTFChar.value;
	if ( ATFChar && JTFChar.index ){
		ATFChar+=JTFChar.index; //ToDo: convert to unicode subscript nums
								//		for proper exporting.
	};
	if ( JTFChar.type==='log' ) {
		ATFChar = ATFChar.toUpperCase();
	} else if ( JTFChar.type==='syl' ) {
		ATFChar = ATFChar.toLowerCase();
	} else if ( JTFChar.type==='det' ) {
		ATFChar = '{'+ATFChar.toLowerCase()+'}';
	} else if ( JTFChar.type==='num' && JTFChar.unit ) {
		ATFChar = ATFChar+'('+JTFChar.unit+')';
	};
	if ( JTFChar.damage==='#' ) {
		ATFChar = ATFChar+'#';
	} else if ( JTFChar.damage===true ) {
		ATFChar = '['+ATFChar+']';
	};
	return ATFChar;
}

exports.JTFChar2ATFO = JTFChar2ATFO;