var showdown = require("showdown")
var h2p = require("html2plaintext")
var cheerio = require("cheerio")
var typeOf = require("typeof");
var _ = require("underscore")

module.exports = function(input){

    var converter = new showdown.Converter()
    converter.setOption("noHeaderId", true);
    converter.setOption("completeHTMLDocument", false);

    var source = ""
    var rendered = ""
    var copy = []
    var code = []
    var markup = {}

    source = input
    rendered = converter.makeHtml(source)
    copy = extractCopy(rendered)
    code = extractCode(rendered)
    markup = cheerio.load(rendered)

    function extractCopy(data){
        var data = data.split(tagPattern("code"))
        each(data, function(element, i){
          data[i] = h2p(element)
        })
        return data
    }

    function extractCode(data){
        var data = cheerio.load(data)
        var array = []
        data("code").each(function(index, element){
          array.push(cheerio(this).text())
        })
        return array
    }

    function find(pattern, rendition){
        if(type(rendition, "string")){
          return match(pattern, rendition)
        }
        else if(type(rendition, "array")){
          return findOne(pattern, rendition);
        }
    }

    function findOne(pattern,rendition){
      var found = false
      each(rendition, function(element, i){
        if(match(pattern, element)){
          found = true
        }
      })
      return found
    }

    function findAll(pattern, rendition){
      var count = 0
      each(rendition, function(element, i){
        if(match(pattern, element)){
          count++
        }
      })
      return count == rendition.length
    }

    function match(pattern, element){
        if(type(pattern, "regexp")){
          return pattern.test(element)
        }
        else if(type(pattern, "string")){
          return element.indexOf(pattern) > -1
        }
    }

    function select(selector, markup){
        return markup(selector).length > 0
    }

    function type(object, type){
      return typeOf(object) == type
    }

    function error(message){
        throw new Error(message)
    }

    function tagPattern(tag){
      var string = "<" + tag + "[\\s\\S]*?\\/" + tag + ">"
      var regex = new RegExp(string)
      return regex
    }

    function each(data, execute){
      _.each(data, execute)
    }

    function detect(type, pattern, rendition){
      if(type == "markup"){
        return select(pattern, rendition)
      }
      else{
        return find(pattern, rendition)
      }
    }

    function handle(type, expected, pattern, rendition, message){
        if(detect(type, pattern, rendition) != expected){
            error(message)
        }
      }

    var methods = {
        source: {
            has: function(pattern){
              handle("source", true, pattern, source, "The expected content was not in the source")
            },
            no: function(pattern){
              handle("source", false, pattern, source, "The unexpected content was in the source")
            }
        },
        rendered: {
           has: function(pattern){
             handle("rendered", true, pattern, rendered, "The expected content was not in the rendered HTML")
           },
           no: function(pattern){
             handle("rendered", false, pattern, rendered, "The unexpected content was in the rendered HTML")
           }
       },
       copy: {
           has: function(pattern){
             handle("copy", true, pattern, copy, "The expected content was not in the copy")
           },
           no: function(pattern){
             handle("copy", false, pattern, copy, "The unexpected content was in the copy")
           }
        },
        code: {
            has: function(pattern){
              handle("code", true, pattern, code, "The expected content was not in the code")
            },
            no: function(pattern){
              handle("code", false, pattern, code, "The unexpected content was in the code")
            }
         },
        markup: {
            has: function(pattern){
              handle("markup", true, pattern, markup, "The expected selector was not in the markup")
            },
            no: function(pattern){
              handle("markup", false, pattern, markup, "The unexpected selector was in the markup")
            }
         }
    }

    return methods
}
