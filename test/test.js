var markunit = require("../lib/markunit.js")
var fs = require('fs');

var doc = markunit(fs.readFileSync("test/test.md", "utf8"))

describe("Source", function(){
    it("should find a string in the source Markdown", function(){
        doc.source.has("# Test document")
    })
    it("should find a \\n newline character", function(){
        doc.source.has("# Test document")
    })
    it("should find a pattern with regex", function(){
        doc.source.has(/fil.+?ed/)
    })
    it("should find a subpattern from an array", function(){
        doc.source.has(["Test", /abcd/, "document"])
    })
    it("should not find a string with different casing", function(){
        doc.source.no("# test document")
    })
    it("should not find a string that is not in the source Markdown", function(){
        doc.source.no("Doesn't exist")
    })
    it("should not find a pattern that doesn't exist with regex", function(){
        doc.source.no(/filll.+?ed/)
    })
    it("should not find a subpattern from an array that doesn't exist", function(){
        doc.source.no(["Not in there", /abcd/])
    })
})

describe("Rendered", function(){
    it("should find the HTML translation of a source Markdown element", function(){
        doc.rendered.has("<h1>Test document</h1>")
    })
    it("should find an HTML element that was present in the source Markdown", function(){
        doc.rendered.has("<em>testing</em>")
    })
    it("should find a pattern with regex", function(){
        doc.rendered.has(/<em>.*?<\/em>/)
    })
    it("should find a subpattern from an array", function(){
        doc.source.has(["<p>", "<img>", "<b>"])
    })
    it("should not find an HTML element with incorrect content", function(){
        doc.rendered.no("<h1>Not the title</h1>")
    })
    it("should not find an HTML element that doesn't exist at all", function(){
        doc.rendered.no("<i></i>")
    })
    it("should not find a pattern that doesn't exist with regex", function(){
        doc.rendered.no(/^<p>/)
    })
    it("should not find a subpattern from an array that doesn't exist", function(){
        doc.source.no(["<i>", /abcd/])
    })
})

describe("Copy", function(){
    it("should find a string that isn't in a code element", function(){
        doc.copy.has("testing purposes")
    })
    it("should find a string whose HTML has nested elements", function(){
        doc.copy.has("for testing purposes")
    })
    it("should find a pattern with regex", function(){
        doc.copy.has(/testing .*? of/)
    })
    it("should find a subpattern from an array", function(){
        doc.source.has(["Test", /abcd/, "document"])
    })
    it("should not find a string that only exists in code elements", function(){
        doc.copy.no("markunit.js")
    })
    it("should not find a string with casing that's only present in code elements", function(){
        doc.copy.no("markunit")
    })
    it("should not find a string that is created by the removal of code elements", function(){
        doc.copy.no("purposes of only")
    })
    it("should not find a pattern that doesn't exist with regex", function(){
        doc.copy.no(/of .*? only/)
    })
    it("should not find a subpattern from an array that doesn't exist", function(){
        doc.source.no(["Not in there", /1234/])
    })
})

describe("Code", function(){
    it("should find a string in an inline code element", function(){
        doc.code.has("markunit.js")
    })
    it("should find a string in a standalone code block", function(){
        doc.code.has("testing = true")
    })
    it("should find a pattern with regex", function(){
        doc.code.has(/var.*?true/)
    })
    it("should find a subpattern from an array", function(){
        doc.source.has(["mark", "javascript", "document"])
    })
    it("should not find code that isn't present", function(){
        doc.code.no("$ npm install")
    })
    it("should not find the tick marks used to demarcate code blocks in Markdown", function(){
        doc.code.no("```")
    })
    it("should not find a string that is created by the removal of non-code elements", function(){
        doc.code.no("true test.js")
    })
    it("should not find a pattern that doesn't exist with regex", function(){
        doc.code.no(/testing ==/)
    })
    it("should not find a subpattern from an array that doesn't exist", function(){
        doc.source.no(["JS", /html/])
    })
})

describe("Markup", function(){
    it("should find the HTML translation of a Markdown element", function(){
        doc.markup.has("p")
    })
    it("should find an HTML element that was present in the source Markdown", function(){
        doc.markup.has("em")
    })
    it("should not find a selector that is not present", function(){
        doc.markup.no("li li")
    })
    it("should not find a nested selector when a single level selector is present", function(){
        doc.markup.no("p p")
    })
})
