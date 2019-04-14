var showdown = require("showdown");
var h2p = require("html2plaintext");
var cheerio = require("cheerio");
var typeOf = require("typeof");
var _ = require("underscore");

module.exports = function(input) {
  var converter = new showdown.Converter();
  converter.setOption("noHeaderId", true);
  converter.setOption("completeHTMLDocument", false);

  var input = input;
  var ignore = [];
  var source = "";
  var rendered = "";
  var copy = [];
  var code = [];
  var markup = {};

  generateRenditions();

  function generateRenditions() {
    source = filterSource(ignore, input);
    rendered = render(source);
    copy = extractCopy(rendered);
    code = extractCode(rendered);
    markup = cheerio.load(rendered);
  }

  function render(source) {
    var data = source;
    data = converter.makeHtml(data);
    data = data.replace(/[\r\n]/g, "");
    return data;
  }

  function setIgnore(pattern) {
    var data = [];
    if (pattern != null) {
      if (type(pattern, "array")) {
        each(pattern, function(subpattern) {
          data.push(subpattern);
        });
      } else {
        data.push(pattern);
      }
    }
    ignore = data;
    generateRenditions();
  }

  function filterSource(pattern, source) {
    var data = source;
    if (type(pattern, "array")) {
      each(pattern, function(subpattern) {
        data = remove(subpattern, data);
      });
    } else {
      data = remove(pattern, data);
    }
    return data;
  }

  function remove(pattern, source) {
    return source.replace(pattern, "");
  }

  function extractCopy(data) {
    var data = data.split(tagPattern("code"));
    each(data, function(element, i) {
      var subdata = h2p(element);
      subdata = subdata.replace(/[\r\n]/g, "");
      data[i] = subdata;
    });
    return data;
  }

  function extractCode(data) {
    var data = cheerio.load(data);
    var array = [];
    data("code").each(function(index, element) {
      array.push(cheerio(this).text());
    });
    return array;
  }

  function find(pattern, rendition) {
    var found = false;
    if (type(rendition, "string")) {
      found = match(pattern, rendition);
    } else if (type(rendition, "array")) {
      each(rendition, function(subrendition) {
        if (match(pattern, subrendition)) {
          found = true;
        }
      });
    }
    return found;
  }

  function match(pattern, element) {
    if (type(pattern, "regexp")) {
      return pattern.test(element);
    } else if (type(pattern, "string")) {
      return element.indexOf(pattern) > -1;
    }
  }

  function select(selector, markup) {
    return markup(selector).length > 0;
  }

  function type(object, type) {
    return typeOf(object) == type;
  }

  function error(message) {
    throw new Error(message);
  }

  function tagPattern(tag) {
    var string = "<" + tag + "[\\s\\S]*?\\/" + tag + ">";
    var regex = new RegExp(string);
    return regex;
  }

  function each(data, execute) {
    _.each(data, execute);
  }

  function detect(form, pattern, rendition) {
    var detected = false;
    if (form == "markup") {
      detected = select(pattern, rendition);
    } else {
      if (type(pattern, "array")) {
        each(pattern, function(subpattern) {
          if (find(subpattern, rendition)) {
            detected = true;
          }
        });
      } else {
        detected = find(pattern, rendition);
      }
    }
    return detected;
  }

  function handle(form, expected, pattern, rendition, message) {
    if (detect(form, pattern, rendition) != expected) {
      error(message);
    }
  }

  function compose(pattern, message) {
    return formatPattern(pattern) + " " + message;
  }

  function formatPattern(pattern) {
    var output = "";
    if (type(pattern, "array")) {
      output = "At least one item from the array [";
      each(pattern, function(subpattern, index) {
        if (type(subpattern, "regexp")) {
          output = output + subpattern;
        } else {
          output = output + '"' + subpattern + '"';
        }
        if (index < pattern.length - 1) {
          output = output + ", ";
        } else {
          output = output + "]";
        }
      });
    } else if (type(pattern, "regexp")) {
      output = "The regular expression " + pattern;
    } else {
      output = 'The string "' + pattern + '"';
    }
    return output;
  }

  function log(message) {
    console.log(message);
  }

  var errors = {
    source: {
      has: function(pattern) {
        return compose(
          pattern,
          "was expected in the source Markdown, but wasn't found."
        );
      },
      no: function(pattern) {
        return compose(
          pattern,
          "was found in the source Markdown, but wasn't expected."
        );
      }
    },
    rendered: {
      has: function(pattern) {
        return compose(
          pattern,
          "was expected the rendered HTML, but wasn't found."
        );
      },
      no: function(pattern) {
        return compose(
          pattern,
          "was found in the rendered HTML, but wasn't expected."
        );
      }
    },
    copy: {
      has: function(pattern) {
        return compose(
          pattern,
          "was expected in the copy, but wasn't found."
        );
      },
      no: function(pattern) {
        return compose(
          pattern,
          "was found in the copy, but wasn't expected."
        );
      }
    },
    code: {
      has: function(pattern) {
        return compose(
          pattern,
          "was expected in the code, but wasn't found."
        );
      },
      no: function(pattern) {
        return compose(
          pattern,
          "was found in the code, but wasn't expected."
        );
      }
    },
    markup: {
      has: function(pattern) {
        return compose(
          pattern,
          "was expected in the markup structure, but wasn't found."
        );
      },
      no: function(pattern) {
        return compose(
          pattern,
          "was found in the markup structure, but wasn't expected."
        );
      }
    }
  };

  var methods = {
    ignore: function(pattern) {
      setIgnore(pattern);
    },
    source: {
      has: function(pattern) {
        handle("source", true, pattern, source, errors.source.has(pattern));
      },
      no: function(pattern) {
        handle("source", false, pattern, source, errors.source.no(pattern));
      }
    },
    rendered: {
      has: function(pattern) {
        handle(
          "rendered",
          true,
          pattern,
          rendered,
          errors.rendered.has(pattern)
        );
      },
      no: function(pattern) {
        handle(
          "rendered",
          false,
          pattern,
          rendered,
          errors.rendered.no(pattern)
        );
      }
    },
    copy: {
      has: function(pattern) {
        handle("copy", true, pattern, copy, errors.copy.has(pattern));
      },
      no: function(pattern) {
        handle("copy", false, pattern, copy, errors.copy.no(pattern));
      }
    },
    code: {
      has: function(pattern) {
        handle("code", true, pattern, code, errors.code.has(pattern));
      },
      no: function(pattern) {
        handle("code", false, pattern, code, errors.code.no(pattern));
      }
    },
    markup: {
      has: function(pattern) {
        handle("markup", true, pattern, markup, errors.markup.has(pattern));
      },
      no: function(pattern) {
        handle("markup", false, pattern, markup, errors.markup.no(pattern));
      }
    }
  };

  return methods;
};
