// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com/**
// @icon         https://www.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    // Bắt sự kiện ajax request
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if (this.readyState === 4 && this.responseURL=="https://www.facebook.com/api/graphql/") {
                // In header của response ra console
                // console.log(this.responseURL);
                try{
                    const obj = JSON.parse(this.responseText);
                    // console.log(obj);

                }catch(ex){
                    try{
                        let lines = this.responseText.split("\n");
                        for (let index = 0;index<lines.length;index++){
                            try {
                                let obj = JSON.parse(lines[index]);
                                let __data = obj["data"]
                                let __node=__data["node"]
                                let __comet_sections=__node["comet_sections"]
                                let __content=__comet_sections["content"]
                                let story = __content["story"]
                                let text = story["message"]["text"]
                                let id = story["id"]
                                let url = story["wwwURL"]
                                let actors = []
                                for (let index_2 = 0;index_2<story["actors"].length;index_2++){
                                    actors.push({
                                        "id":story["actors"][index_2]["id"],
                                        "name":story["actors"][index_2]["name"]
                                    })
                                }
                                
                                let post = {
                                    "id":id,
                                    "url":url,
                                    "actors":actors,
                                    "text":text,
                                }
                                alert(JSON.stringify(post,null, 2))
                                console.log(JSON.stringify(post,null, 2))
                            } catch (error) {
                                // console.log(error)
                            }
                        }
    
                    }catch(ex){
                        
                    }
                }
                
            }
        }, false);
        open.apply(this, arguments);
    };
})();
