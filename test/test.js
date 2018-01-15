var markunit = require("../lib/markunit.js")
var doc = markunit("# Test document\nThis document is used for testing purposes _only_.\n\nThanks!")

describe("The source", function(){
    it("should contain the string \"# Test document\"", function(){
        doc.source.has("# Test document")
    })
    it("should not contain the string \"Doesn't exist\"", function(){
        doc.source.no("Doesn't exist")
    })
})
