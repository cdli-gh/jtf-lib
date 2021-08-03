//
// This script generates the JTF JSON schema.
// To read it in a convenient way, use e.g.:
// https://pypi.org/project/json-schema-for-humans/
// https://github.com/adobe/jsonschema2md
/*---/ Schema templates /---------------------------------------------------*/

let version = "0.1.0";

const basicSchema = {
	type: 'object',
	properties: {
		_class: {type: 'string'},
	},
	required: ['_class'],
};

const typeSchema = {
	type: 'object',
	properties: {
		_class: {type: 'string'},
		type: {type: 'string'},
	},
	required: ['_class', 'type']
};

const containerSchema = {
	type: 'object',
	properties: { 
		_class: {type: 'string'},
		type: {type: 'string'},
		name: {type: 'string'},
		children: {type: 'array', items: {type: 'object'}},
	},
	required: ['_class', 'type', 'name', 'children']
};
/*---/ Schema maker /-------------------------------------------------------*/
	
const makeSchema = function(tempSchema, clss, description, propsDict={}, 
	required=[]){
	// Make schema with few params using template and _class regex property.
	// Parameters:
	// _class (string or regex)
	//	JTF class
	// propsDict (json schema `properties` object)
	//		additional properties fields to add to the template
	// required (array of field names)	
	//		additional required fields to add to the template
	var schema = Object.assign({}, tempSchema);
	var classPattern = "^"+clss+"$";
	schema.properties._class.pattern = classPattern;
	schema.properties = Object.assign({}, schema.properties, propsDict);
	schema.required = schema.required.concat(required);
	schema.description = description;
	//schema.version = version;
	schema.$id = '#'+clss.toLowerCase();
	return JSON.parse(JSON.stringify(schema));
};

/*---/ Definitions: make /--------------------------------------------------*/

const chrSchema = makeSchema(typeSchema, "chr",
	`Character.`,
	{	
		// minimal
		value: {type: 'string'},
		// optional
		index: {type: 'number'},
		separator: {type: 'string'},
		unit: {type: 'string'},
		emendation: {type: 'string'},
		gloss: {type: 'string'},
		exclamation: {type: 'boolean'},
		question: {type: 'boolean'},
		damage: {type: 'boolean'},
		collation: {type: 'boolean'},
		note: {type: 'string'},
		// non-ATF
		graphics: {type: 'object'}, //{'image': {}},
		// UqNU only
		mode: {type: 'string'}, //['edit', 'hint', 'ready', 'incorrect']
		inputValue: {type: 'string'},
		order: {type: 'string'},
	},
	['value']
);

const sequenceSchema = makeSchema(containerSchema, "Sequence",
	`Sequence of transliteration characters.`,
	{
		children: {
			type: 'array',
			items: {"$ref": "#chr"}
		},
	},
);

const fieldSchema = makeSchema(typeSchema, "Field",
	`Inline field.`
)

const commentSchema = makeSchema(typeSchema, "Comment", 
	`Commentary.`,
	{
		value: {type: 'string'},
	},
	['value']
);

const inlineSchema = {
	$id: '#inline',
	//version: version,
	description: `Inline elements.`,
	anyOf: [
		{ "$ref": "#sequence" },
		{ "$ref": "#field" },
		{ "$ref": "#comment" },
	],
};

const lineSchema = makeSchema(containerSchema, "Line",
	`Line.`,
	{
		children: {
			type: 'array',
			items: {"$ref": "#inline"}
		},
	},
);

const rulingSchema = makeSchema(basicSchema, "Ruling",
	`Ruling.`,
	{repeat: {type: 'number'},}, ['repeat']
);

const stateScheme = makeSchema(basicSchema, "State",
	`State.`,
	{
		extent: {type: 'string'},
		qualification: {type: 'string'},
		state: {type: 'string'},
		lacuna: {type: 'string'},
	},
);

const sealSchema = makeSchema(typeSchema, "Seal", 
	`Seal.`,
	{
		name: {type: 'string'},
	},
	['name']
);

const contentSchema = {
	$id: '#content',
	//version: version,
	description: `Content elements.`,
	anyOf: [
		{ "$ref": "#line" },
		{ "$ref": "#ruling" },
		{ "$ref": "#state" },
		{ "$ref": "#seal" },
	],
};

const columnSchema = makeSchema(containerSchema, "Column",
	`Column.`,
	{
		children: {
			type: 'array',
			items: {"$ref": "#content"}
		},
	},
);

const surfaceSchema = makeSchema(containerSchema, "Surface",
	`Surface.`,
	{
		children: {
			type: 'array',
			items: {'oneOf': [
				{"$ref": "#content"},
				{"$ref": "#column"},
			]},
		},
	},
);

const objectSchema = makeSchema(containerSchema, "Object",
	`Object.`,
	{
		children: {
			type: 'array',
			items: {"$ref": "#surface"},
		},
	}
);

/*---/ All definitions /----------------------------------------------------*/

const definitions = {
	chr: chrSchema,
	inline: inlineSchema,
	sequence: sequenceSchema,
	field: fieldSchema,
	comment: commentSchema,
	line: lineSchema,
	ruling: rulingSchema,
	state: stateScheme,
	seal: sealSchema,
	content: contentSchema,
	column: columnSchema,
	surface: surfaceSchema,
	object: objectSchema,
};

/*---/ JTF schema /---------------------------------------------------------*/

const JTFSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "https://example.com/schemas/abstract",
	title: "JSON Transliteration Format",
	version: version,
	properties: {
		children: {
			type: 'array',
			items: {"$ref": "#/definitions/object"},
		},
	},
	definitions: definitions,
};

/*---/ Schema to string /---------------------------------------------------*/

const JTFSchema2Str = () => {
	// stringify schema.
	return JSON.stringify(JTFSchema, null, 2);
};

console.log(JTFSchema2Str())

/*---/ Exports /------------------------------------------------------------*/

module.exports = {
	definitions,
	JTFSchema,
	JTFSchema2Str,
};

