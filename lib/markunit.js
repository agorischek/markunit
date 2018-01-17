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
        _.each(data, function(element, i){
          data[i] = h2p(element)
        })
        // console.log(data)
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

    function find(substring, rendition){

        if(typeOf(rendition) == "string"){
          return rendition.indexOf(substring) < 0
        }

        else if(typeOf(rendition) == "array"){
          var found = true
          _.each(rendition, function(element, i){
            if(element.indexOf(substring) > -1){
              found = false
            }
          })
          return found
        }
    }

    function select(selector, markup){
        return markup(selector).length < 1
    }

    function error(message){
        throw new Error(message)
    }

    function tagPattern(tag){
      var string = "<" + tag + "[\\s\\S]*?\\/" + tag + ">"
      var regex = new RegExp(string)
      return regex
    }

    var methods = {
        source: {
            has: function(content){
                if(find(content, source)){
                    error("The expected content was not in the source")
                }
            },
            no: function(content){
                if(!find(content, source)){
                    error("The unexpected content was in the source")
                }
            }
        },
        rendered: {
            has: function(content){
                if(find(content, rendered)){
                    error("The expected content was not in the rendered HTML")
                }
            },
            no: function(content){
                if(!find(content, rendered)){
                    error("The unexpected content was in the rendered HTML")
                }
            }
        },
        copy: {
            has: function(content){
                if(find(content, copy)){
                    error("The expected content was not in the copy")
                }
            },
            no: function(content){
                if(!find(content, copy)){
                    error("The unexpected content was in the copy")
                }
            }
        },
        code: {
            has: function(content){
                if(find(content, code)){
                    error("The expected content was not in the code")
                }
            },
            no: function(content){
                if(!find(content, code)){
                    error("The unexpected content was in the code")
                }
            }
        },
        markup: {
            has: function(selector){
                if(select(selector, markup)){
                    error("The expected selector was not in the markup")
                }
            },
            no: function(selector){
                if(!select(selector, markup)){
                    error("The unexpected selector was in the markup")
                }
            }
        }
    }

    return methods
}
