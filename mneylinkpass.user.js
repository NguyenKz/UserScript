// ==UserScript==
// @name         https://mneylinkpass.com/
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match      	 *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mneylinkpass.com
// @grant        none
// ==/UserScript==

(function() {
    add_button();
})();


function add_button(){

	let element_parent = document.body;
    	let header = document.createElement("div");
	header.setAttribute("id","nguyen_button")
	element_parent.insertBefore(header, element_parent.firstChild);
	element_parent = document.getElementById("nguyen_button")
	element_parent.innerHTML = "<p></p>"
	let button = document.createElement("button");
	button.innerHTML = "<p>Page source</p>";
	button.addEventListener ("click", function() {
		let pattern = /el.html\(([\w]+)\)/i;
		let result = pattern.exec(document.body.innerHTML);
		let source = document.createElement("div");
		source.innerHTML = "<p>"+result+"</p>"
		element_parent.insertBefore(source, element_parent.firstChild);
		console.log(source.innerHTML )
	});

	element_parent.insertBefore(button, element_parent.firstChild);

}


function _x(path){
	var xpath = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	  var temp = [];
	  for (var i = xpath.snapshotLength - 1; i >= 0; i--) {
		temp.push(xpath.snapshotItem(i));
	  }
	  return temp;
}
