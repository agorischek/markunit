# Markunit
Assert library for unit testing Markdown

## Useful for
* Ensuring your library's or company's name is spelled and capitalized correctly
* Reviewing for undesired structures, such as multi-level lists
* Checking for profanity

## Installation

Get the package from npm:
```
$ npm install -save markunit
```

Then require the package and load your Markdown document:
```
var markunit = require("../lib/markunit.js")
var doc = markunit("# Test document\nThis document is used for testing purposes of `markunit.js` _only_.\n\nThanks!")
```

## Methods

### Source
Check for the presence or absence of strings in the source Markdown:

```
doc.source.has("# Test document") // true
doc.source.no("Doesn't exist") // true
```

### Rendered
Check for the presence or absense of strings in the rendered HTML:
```
doc.rendered.has("<h1>Test document</h1>") // true
doc.rendered.no("<h1>Not the title</h1>") // true
```

### Copy
Check for the presence or absense of strings in contents of the doc, excluding `code` elements:
```
doc.copy.has("testing purposes of only") // true
doc.copy.no("markunit.js") // true
```

### Code
Check for the presence or absense of strings in contents of only the `code` elements:
```
doc.code.has("markunit.js") // true
doc.code.no("$ npm install") // true
```

### Markup
Check for the presence or absense of `jquery`-style selectors:
```
doc.markup.has("p") // true
doc.markup.no("li li") // true
```