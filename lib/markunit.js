var showdown = require("showdown")
var h2p = require("html2plaintext")
var cheerio = require("cheerio")

module.exports = function(input){
    
    var converter = new showdown.Converter()
    converter.setOption("noHeaderId", true);
    converter.setOption("completeHTMLDocument", false);
    
    var source = input;
    var rendered = converter.makeHtml(source);
    var body = extractBody(rendered);
    var copy = extractCopy(body);
    var code = extractCode(body);
    var tags = extractTags(body);
    var markup = cheerio.load(tags);
        
    function extractBody(data){
        var data = data
        data = data.replace(/^<head><\/head><body>/, "")
        data = data.replace(/<\/body>$/, "")
        return data
    }
        
    function extractCopy(data){
        var data = cheerio.load(data)
        data = data("*").remove("code")
        data = data.html()
        data = extractBody(data)
        data = h2p(data)
        return data
    }
    
    function extractCode(data){
        var data = cheerio.load(data)
        var array = []
        data = data("code").each(function(index, element){
          array.push(cheerio(this).text())
        })
        data = array.join("")
        return data
    }
    
    function extractTags(data){
        var data = data
        var tag = /<.+>/g
        data = data.match(/<.+?>/g)
        data = data.join("")
        return data
    }
    
    function find(substring, string){
        return string.indexOf(substring) < 0
    }
    
    function select(selector, markup){
        return markup(selector).length < 1
    }
    
    function error(message){
        throw new Error(message)
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