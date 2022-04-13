const F = require('../Formatter/JTFFormatter.js');

const ElementFromTemplate = function(JTFClass){
	//
	let template = F.templates[JTFClass];
	let JTFElement = {};
	Object.keys(template).forEach(key => {
		if (key==='_class') {
			JTFElement[key] = JTFClass;
		} else if (Array.isArray(template[key])){
			template[key].forEach(field => {
				if (field==='children') {
					JTFElement[field] = [];
				} else {
					JTFElement[field] = null;
				};
			});
		} else {
			JTFElement[key] = null;
		};
	});
	return JTFElement;
};

const Strip = function(JTFElement){
	//
	if (!JTFElement){
		return;
	};
	if (JTFElement.objects){
		if (!JTFElement.success){ return; }
		JTFElement.objects = JTFElement.objects.map( o => Strip(o) );
		return JTFElement;
	};
	let template = F.templates[JTFElement._class];
	let JTFStripped = {_class: JTFElement._class};
	Object.keys(template).forEach(key => {
		if (['_props_basic', '_props_optional'].includes(key)) {
			template[key].forEach(field => {
				if (JTFElement[field]){
					JTFStripped[field] = (Array.isArray( JTFElement[field] ))
					? JTFElement[field].map( el => Strip(el) ) 
					: JTFElement[field];
				};
			});
		}
	});
	return JTFStripped;
};

const Create = function(JTFClass='Object', {container, index, params}={}){
	if (!Object.keys(F.templates).includes(JTFClass)){
		error = {
			agent: 'JTFCRUD',
			type: 'Unknown JTF _class',
			text: `JTFCRUD create Error: Unknown class "${JTFClass}"`,
			action: 'skipped'
		};
		console.log(error.text);
		if (container){
			return F.pushWarningUp(error, container);
		};
		return error;
	};
	let JTFElement = ElementFromTemplate(JTFClass);
	if (container){
		if (index){
			container.children.splice(index, 0, JTFElement);
		} else {
			container.children.push(JTFElement);
		};
		JTFElement.parent = container;
	};
	return JTFElement;
};

const Read = function(JTFElement){
	return JTFElement;
};

const Update = function(JTFElement, params){
	
};

const Delete = function(JTFElement){	
};

exports.Strip = Strip;
exports.Create = Create;
exports.Read = Read;
exports.Update = Update;
exports.Delete = Delete;
