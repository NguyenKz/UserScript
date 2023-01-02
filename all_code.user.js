// ==UserScript==
// @name         all code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *
// @match        https://*/*
// @grant        none
// ==/UserScript==


(function() {
    add_button();
})();


function add_button(){
	try{
		traffic_wait_time = 1;
	}catch(e){
	
	}
	let element_parent = document.body;
    	let header = document.createElement("div");
	header.setAttribute("id","nguyen_button")
	element_parent.insertBefore(header, element_parent.firstChild);
	element_parent = document.getElementById("nguyen_button")

    //>>Lấy MÃ ROBOT
	let pattern = /<div>Mã của bạn là: ([\w]+)<\/div>/;
	let result = pattern.exec(document.body.innerHTML);
    	element_parent.innerHTML = "<p>Lấy MÃ ROBOT: "+result[1]+"</p>"
    
    
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
