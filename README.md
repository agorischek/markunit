<img width="200" src="img/icon.png" alt="Markunit icon" />

# Markunit

A simple assertion library for unit testing Markdown.

[![Build Status](https://img.shields.io/travis/agorischek/markunit.svg)](https://travis-ci.org/agorischek/markunit)
[![Version](https://img.shields.io/npm/v/markunit.svg)](https://www.npmjs.com/package/markunit)
[![License](https://img.shields.io/github/license/agorischek/markunit.svg)](https://github.com/agorischek/markunit/blob/master/LICENSE)

## Wait a second...

Unit testing ***Markdown***? Yeah, it might sound odd. But Markdown is code, and it can have bugs just like anything else. Maybe there are lingering references to an API call you’ve removed. Or you want to avoid double-level lists for stylistic reasons. Or perhaps contributors keep misspelling your library's name. Wouldn’t it be nice to catch those things automatically? Exactly. Markunit provides assert methods for analyzing your Markdown content and the HTML it creates, which can be run inside your favorite test runner and continuous integration system.

## Installation

Get the package from npm:

```bash
$ npm install markunit
```

Then require the package and load your Markdown document:

```js
var markunit = require("markunit")
var markdown = "# Test document\nThis is _example_ Markdown content for `markunit.js` documentation."
var doc = markunit(markdown)
```

## Renditions
There are five different renditions of the original Markdown content that can be analyzed: `source`, `rendered`, `copy`, `code`, and `markup`. Each of them possesses a `.has()` and a `.no()` method.

### Source
Check for the presence or absence of patterns in the source Markdown:

```js
// Will look for text matches in "# Test document\nThis is _example_ Markdown content for `markunit.js` documentation."
doc.source.has("# Test document") // pass
doc.source.no("Doesn't exist") // pass
```

### Rendered
Check for the presence or absence of patterns in the rendered HTML:

```js
// Will look for text matches in "<h1>Test document</h1><p>This is <em>example</em> Markdown content for <code>markunit.js</code>" documentation.</p>
doc.rendered.has("<h1>Test document</h1>") // pass
doc.rendered.no("<h1>Not the title</h1>") // pass
```

### Copy
Check for the presence or absence of patterns in contents of the doc, excluding `code` elements:

```js
// Will look for text matches in "Test document This is example Markdown content for" and "documentation."
doc.copy.has("This is example Markdown") // pass
doc.copy.no("markunit.js") // pass
```

### Code
Check for the presence or absence of patterns in contents of only the `code` elements:

```js
// Will look for text matches in "markunit.js"
doc.code.has("markunit.js") // pass
doc.code.no("mark-unit.js") // pass
```

### Markup
Check for the presence or absence of `jquery`-style [selectors](https://cheerio.js.org):

```js
// Will look for structural matches in "<h1></h1><p><em></em><code></code></p>"
doc.markup.has("p") // pass
doc.markup.no("li li") // pass
```

## Patterns

For the `source`, `rendered`, `copy`, and `code` renditions, the pattern to match can be a string, a regular expression, or an array of either. For the `markup` rendition, the pattern can be a string or an array of strings, where each string represents a `jquery`-style [selector](https://cheerio.js.org). A _single match_ from an array is sufficient for the `.has()` method to pass or the `.no()` method to fail.

```js
doc.source.has("test") // pass
doc.source.has(/t.?*t/) // pass
doc.source.has(["test", /Not present/]) // pass
```

## Ignoring

A pattern can be excluded from review using `.ignore()`, which will completely remove matches from the input Markdown. The pattern to ignore can be a string, a regular expression, or an array of either. Subsequent calls will overwrite the pattern, and passing `null` will clear the pattern.

```js
doc.ignore("content")
doc.source.no("content") // pass
```

## Example Usage

The below demonstrates a simple setup and test suite for the typical repository README, using a framework like [Mocha](https://mochajs.org).

```js
var markunit = require("markunit")
var fs = require('fs')

var input = fs.readFileSync("./README.md", "utf8")
var readme = markunit(input)
readme.ignore("It’s spelled MyLibrary, not my-library.")

describe("README", function(){
  it("should have a title", function(){
    readme.markup.has("h1")
  })
  it("should not contain double-indented lists", function(){
    readme.markup.no("li li")
  })
  it("should not have any raw HTML in the source", function(){
    readme.source.no(/<.*?>.*?<\/.*?>/)
  })
  it("should have a link to npm", function(){
    readme.rendered.has(/<a.*?href="https:\/\/npmjs\.com/)
  })
  it("should not spell the library name with a hyphen", function(){
    readme.copy.no("my-library")
  })
  it("should not have any curly quotes in code snippets", function(){
    readme.code.no(["“","”"])
  })
  it("should not reference old API calls", function(){
    readme.code.no(["deprecatedCall1(", "deprecatedCall2(", "deprecatedCall3("])
  })
  it("should contain installation instructions", function(){
    readme.code.has("npm install")
  })
})
```
