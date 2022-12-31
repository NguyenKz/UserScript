// ==UserScript==
// @name         Get code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mneylink.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
   setInterval(function () {
       add_button();
   }, 5000
   );
   
})();

function add_button(){

	let element_parent = document.getElementsByTagName("body")[0];
    let header = document.createElement("div");
	header.setAttribute("id","nguyen_button")
	element_parent.insertBefore(header, element_parent.firstChild);
	element_parent = document.getElementById("nguyen_button")
	element_parent.innerHTML = "<p></p>"

    let list_frame = _x('//iframe[@src]');
    for (let i =0 ;i <list_frame.length; i++){
        let button = document.createElement("button");
        button.innerHTML = "<p>"+i+"</p>";
        button.addEventListener ("click", function() {
            document.location.href = list_frame[i].src;
        });
        element_parent.insertBefore(button, element_parent.firstChild);
    }
}


function _x(path){
	var xpath = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	  var temp = [];
	  for (var i = xpath.snapshotLength - 1; i >= 0; i--) {
		temp.push(xpath.snapshotItem(i));
	  }
	  return temp;
}
