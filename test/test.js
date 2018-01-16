var markunit = require("../lib/markunit.js")
var fs = require('fs');

var doc = markunit(fs.readFileSync("test/test.md", "utf8"))

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
    it("should contain the string \"testing purposes\"", function(){
        doc.copy.has("testing purposes")
    })
    it("should contain the string \"testing purposes of only\"", function(){
        doc.copy.has("testing purposes of only")
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