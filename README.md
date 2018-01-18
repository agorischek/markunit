<img width="180" src="img/icon.png" alt="Markunit icon" />

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
There are five different renditions of the original Markdown content that can be analyzed: `source`, `rendered`, `copy`, `code`, and `markup`. Each of them possesses a `.has()` and a `.no()` method. The `markup` methods accept only strings, while all others accept both strings and regular expressions.

### Source
Check for the presence or absence of strings or patterns in the source Markdown:

```js
doc.source.has("# Test document") // pass
doc.source.no("Doesn't exist") // pass
```

### Rendered
Check for the presence or absence of strings or patterns in the rendered HTML:
```js
doc.rendered.has("<h1>Test document</h1>") // pass
doc.rendered.no("<h1>Not the title</h1>") // pass
```

### Copy
Check for the presence or absence of strings or patterns in contents of the doc, excluding `code` elements:
```js
doc.copy.has("This is example Markdown") // pass
doc.copy.no("markunit.js") // pass
```

### Code
Check for the presence or absence of strings or patterns in contents of only the `code` elements:
```js
doc.code.has("markunit.js") // pass
doc.code.no("mark-unit.js") // pass
```

### Markup
Check for the presence or absence of `jquery`-style [selectors](https://cheerio.js.org):
```js
doc.markup.has("p") // pass
doc.markup.no("li li") // pass
```
