
//---/ Flatten all nested arrays /--------------------------------------------
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
			new_array.push( x );
		};
	}, array);
	return new_array;
};

//===/ sign structure scripts /===============================================

const num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "x"];
const numS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", 'ₓ'];

const escapeSNum = function( num_str ) {
	// Escape Unicode lowerscript numerals
	var new_num = [];
	//console.log(typeof num_str, num_str);
	num_str.split('').forEach(function(n){
		if ( numS.includes(n) ) {
			new_num.push(num[numS.indexOf(n)]);
		} else if ( num.includes(n) ) {
			new_num.push(n);
		}
	});
	return new_num.join('');
};

exports.flatAll = flatAll;
exports.escapeSNum = escapeSNum;
