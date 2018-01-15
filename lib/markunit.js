var showdown = require("showdown")
var $ = require("cheerio")

module.exports = function(input){
    
    var converter = new showdown.Converter()
    
    var source = input;
    var copy = ""
    var code = ""
    var markup = ""
    var rendered = converter.makeHtml(source)
    
    function find(substring, string){
        return string.indexOf(substring) < 0
    }
    
    function error(message){
        throw new Error(message)
    }
    
    var methods = {
        source: {
            has: function(content){
                if(find(content, input)){
                    error("The expected content was not in the source")
                }
            },
            no: function(content){
                if(!find(content, input)){
                    error("The unexpected content was in the source")
                }
            }
        },
        copy: {
            has: function(content){
                
            },
            no: function(content){
                
            }
        },
        code: {
            has: function(content){
                
            },
            no: function(content){
                
            }
        },
        markup: {
            has: function(selector){
                
            },
            no: function(selector){
                
            }
        },
        rendered: {
            has: function(content){
                
            },
            no: function(content){
                
            }
        }
    }
    return methods
}