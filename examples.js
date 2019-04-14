// Example uses of Markunit

var markunit = require("markunit");
var fs = require("fs");
var readme = markunit(fs.readFileSync("./README.md", "utf8"));

describe("Documentation", function() {
  it("should have a title", function() {
    readme.markup.has("h1");
  });
  it("should not have any curly quotes in code snippets", function() {
    readme.code.no(["“", "”"]);
  });
  it("should have installation instructions", function() {
    readme.code.has("npm install");
  });
  it("should capitalize 'HTML' when used in copy", function() {
    readme.copy.no("html");
  });
  it("should not contain double-indented lists", function() {
    readme.markup.no("li li");
  });
});
