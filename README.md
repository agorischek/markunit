<img width="150" src="img/icon.png" alt="Markunit icon" />

# Markunit
A simple assert library for unit testing Markdown

## Wait a second...
Unit testing Markdown? Yeah, it might sound odd. But Markdown is code, and it can have bugs just like anything else. Maybe there are lingering references to an API call you’ve removed. Or you want to avoid double-level lists for stylistic reasons. Or perhaps contributors keep misspelling your library's name. Wouldn’t it be nice to catch those things automatically? Exactly. Markunit provides assert methods for analyzing your Markdown content and the HTML it creates, which can be run inside your favorite test runner and continuous integration system.

## Installation

Get the package from npm:
```
$ npm install markunit
```

Then require the package and load your Markdown document:
```
var markunit = require("markunit")
var markdown = "# Test document\nThis is _example_ Markdown content for `markunit.js` documentation."
var doc = markunit(markdown)
```

## Renditions
There are five different renditions of the original Markdown content that can be analyzed: `source`, `rendered`, `copy`, `code`, and `markup`. Each of them possesses a `.has()` and a `.no()` method.

### Source
Check for the presence or absence of strings in the source Markdown:

```
doc.source.has("# Test document") // pass
doc.source.no("Doesn't exist") // pass

```

### Rendered
Check for the presence or absence of strings in the rendered HTML:
```
doc.rendered.has("<h1>Test document</h1>") // pass
doc.rendered.no("<h1>Not the title</h1>") // pass
```

### Copy
Check for the presence or absence of strings in contents of the doc, excluding `code` elements:
```
doc.copy.has("This is example Markdown") // pass
doc.copy.no("markunit.js") // pass
```

### Code
Check for the presence or absence of strings in contents of only the `code` elements:
```
doc.code.has("markunit.js") // pass
doc.code.no("mark-unit.js") // pass
```

### Markup
Check for the presence or absence of `jquery`-style [selectors](https://cheerio.js.org):
```
doc.markup.has("p") // pass
doc.markup.no("li li") // pass
```
