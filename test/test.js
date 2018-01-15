var markunit = require("../lib/markunit.js")
var doc = markunit("# Test document\nThis document is used for testing purposes of `markunit.js` _only_.\n\nThanks!")

describe("Source", function(){
    it("should contain the string \"# Test document\"", function(){
        doc.source.has("# Test document")
    })
    it("should not contain the string \"Doesn't exist\"", function(){
        doc.source.no("Doesn't exist")
    })
})

describe("Rendered", function(){
    it("should contain the string \"<h1>Test document</h1>\"", function(){
        doc.rendered.has("<h1>Test document</h1>")
    })
    it("should not contain the string \"<h1>Not the title</h1>\"", function(){
        doc.rendered.no("<h1>Not the title</h1>")
    })
})

describe("Copy", function(){
    it("should contain the string \"testing purposes only\"", function(){
        doc.copy.has("testing purposes only")
    })
    it("should not contain the string \"Not part of the copy\"", function(){
        doc.copy.no("markunit.js")
    })
})

describe("Code", function(){
    it("should contain the string \"markunit.js\"", function(){
        doc.code.has("markunit.js")
    })
    it("should not contain the string \"$ npm install\"", function(){
        doc.code.no("$ npm install")
    })
})

describe("Markup", function(){
    it("should contain the selector \"p\"", function(){
        doc.markup.has("p")
    })
    it("should not contain selector \"li li\"", function(){
        doc.markup.no("li li")
    })
})