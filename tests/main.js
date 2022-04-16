// Initial test file.
// Update name, comment, and sections that are being tested
const nearley = require("nearley");
const grammarSource = require("../src/ATFParser/ATFStructure/ATFgrammar");
const chai = require("chai");
const assert = chai.assert;
const grammar = nearley.Grammar.fromCompiled(grammarSource);

function nearleyParseErrorMessage(preamble, parser){
    let current = parser.table[parser.current];
    return `${preamble}\n`;
}

function matchWithRule(sourceString, ruleName, expected){
    let parser = new nearley.Parser(grammar, grammar.byName[ruleName]);
    parser.feed(sourceString);
    assert.isTrue(parser.results.length > 0, nearleyParseErrorMessage(`Parser unable to produce results for rule "${ruleName}"`, parser));
    if(parser.results.length > 0){
        assert.deepEqual(parser.results[0], expected);
    }
}

describe("Initial tests", () => {
    it("nearley exists", () => {
        assert.exists(nearley);
    });
    describe("Basic AmpStatement tests", () => {
        it("Can parse a basic ampLine", () => {
            let expected = {_class: 'ampStatement'};
            let input = "&P123456 = Some text here";
            matchWithRule(input, "ampStatement", expected);
        });
    });
});
