// ==UserScript==
// @name         TruyenFullCreateEbook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://truyenfull.vn/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require         https://unpkg.com/jszip@3.1.5/dist/jszip.min.js
// @require         https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=userscripts-mirror.org
// @grant   GM_getValue
// @grant   GM_setValue
// ==/UserScript==

//Init Xpath
var xpath_book_name = '//*[@id="truyen"]/div[1]/div[1]/h3';
var xpath_book_author = '//*[@id="truyen"]/div[1]/div[1]/div[2]/div[2]/div[1]/a';
var xpath_book_status = '//*[@id="truyen"]/div[1]/div[1]/div[2]/div[2]/div[4]/span';
var xpath_book_dis = '//*[@id="truyen"]/div[1]/div[1]/div[3]/div[2]';
var xpath_book_cov = '//*[@id="truyen"]/div[1]/div[1]/div[2]/div[1]/div/img';

var xpath_chap_name = '//*[@id="chapter-big-container"]/div/div/a';
var xpath_chap_cont = '//*[@id="chapter-c"]';
var xpath_btn_next = '//*[@id="next_chap"]';





$(window).bind("load",function() {
 
	try{
		let book_name = _x(xpath_book_name)[0].innerText;
		let book_author = _x(xpath_book_author)[0].innerText;
		let book_status = _x(xpath_book_status)[0].innerText;
		let book_dis = _x(xpath_book_dis)[0].innerHTML;
		let book_cov= _x(xpath_book_cov)[0];
		let book_info = {
			"book_name":book_name,
			"book_author":book_author,
			"book_status":book_status,
			"book_dis":book_dis,
			"book_cov":book_cov
		}
		GM_setValue("book_info",book_info);
		GM_setValue("chaps",[]);
		document.location.href = document.location.href +"/chuong-1";
	}
	catch(err)
	{
		let chap_next = _x(xpath_btn_next);
		if (chap_next.length<=0){
			let list_chap = GM_getValue("chaps",[]);
			alert("Count chap: "+list_chap.length);
			createEbook(GM_getValue("chaps",[]),GM_getValue("book_info",{}))
		}else{

			let chap_name = _x(xpath_chap_name)[0].innerText.replaceAll("<","_").replaceAll(">","_").replaceAll("\\","_").replaceAll("/","_");
			let chap_cont = _x(xpath_chap_cont)[0].innerHTML;
			chap_cont = chap_cont.replaceAll("<br>","__n__").replaceAll("<\br>","__n__");
			chap_cont = _x(xpath_chap_cont)[0].innerText.replaceAll("__n__","\n<br>").replaceAll("\n","\n<br>");
			_x(xpath_chap_cont)[0].innerHTML = chap_cont;

			let chap_info = {
				"chap_name":chap_name,
				"chap_cont":chap_cont,
				"chap_url":document.location.href,
				"pre_url":GM_setValue("pre_url",null)
			};

			let list_chap = GM_getValue("chaps",[]);
			list_chap.push(chap_info);
			GM_setValue("chaps",list_chap);
			GM_setValue("pre_url",document.location.href);
			chap_next[0].click();
		}
	}
})();





function _x(path){
	var xpath = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	  var temp = [];
	  for (var i = xpath.snapshotLength - 1; i >= 0; i--) {
		temp.push(xpath.snapshotItem(i));
	  }
	  return temp;
   }

function createEbook(list_chap,book_info){
	let list_chap_temp = []
	for(let i =0;i<list_chap.length-1;i++){
		let insert = true;
		for(let j =0;i<list_chap_temp.length;j++){
			if (list_chap[i]["chap_url"]==list_chap[j]["chap_url"]){
				insert = false;
				break;
			}
		}
		if (insert){
			list_chap_temp.push(list_chap[i]);
		}
	}
	list_chap = list_chap_temp;
	// Create Toc File
	let toc_body= "";
	let content_item_1 = "";
	let content_item_2 = "";
	let list_chap_html = [];
	for (let i =0;i<list_chap.length;i++){
		let file_name = ""+i;
		while (file_name.length>10){
			file_name="0"+filename;
		}
		file_name+=".html"
		toc_body+="        <navPoint id='c"+i+"' playOrder='"+i+"'>\n\
				<navLabel>\n\
					<text>"+list_chap[i]["chap_name"]+"</text>\n\
				</navLabel>\n\
				<content src='text/"+file_name+"'/>\n\
			</navPoint>\n";


		content_item_1+="    <item id = 'C"+i+"' href = 'text/"+file_name+"' media-type='application/xhtml+xml'/>\n";
		content_item_2+="    <itemref idref='C"+i+"'/>\n";
		let chap_html = "<html xmlns='http://www.w3.org/1999/xhtml'>\n\
	 <head>\n\
	  <title class='BOOK_NAME'>"+book_info["book_name"]+"</title>\n\
	  <link href='../stylesheet.css' rel='stylesheet' type='text/css'>\n\
	  <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>\n\
	 </head>\n\
	 <body>\n\
	  <div class='BOOK_NAME'>\n\
	   "+book_info["book_name"]+"\
	  </div>\n\
	  <div class='author'>\n\
	   Creat Ebook by Nguyên\n\
	  </div>\n\
	  <div class='author'>\n\
	   "+book_info["book_author"]+"\
	  </div>\n\
	  <h4 class='CHAP_NAME'>"+list_chap[i]["chap_name"]+"</h4>\n\
	  <div class='CHAP_CONTENT'>\n\
	  "+list_chap[i]["chap_cont"]+"\n\
	  </div>\n\
	  <h5>Hết Chương Này</h5>\n\
	 </body>\n\
	</html>";
		list_chap_html.push({
			"file_name":file_name,
			"text":chap_html
		});
	}

	let toc_file = "<?xml version='1.0' encoding='utf-8'?>\n\
	<ncx xmlns='http://www.daisy.org/z3986/2005/ncx/' version='2005-1' xml:lang='vi'>\n\
		<head>\n\
			<meta content='0c159d12-f5fe-4323-8194-f5c652b89f5c' name='dtb:uid'/>\n\
			<meta content='2' name='dtb:depth'/>\n\
			<meta content='calibre (0.8.68)' name='dtb:generator'/>\n\
			<meta content='0' name='dtb:totalPageCount'/>\n\
			<meta content='0' name='dtb:maxPageNumber'/>\n\
		</head>\n\
		<docTitle>\n\
			<text>"+book_info["book_name"]+"</text>\n\
		</docTitle>\n\
		<navMap>\n\
	"+toc_body+"\n\
		</navMap>\n\
	</ncx>"

	//Create content file

	let content_file = "<?xml version='1.0' encoding='utf-8'?>\n\
	<package xmlns='http://www.idpf.org/2007/opf' version='2.0' unique-identifier='uuid_id'>\n\
		<metadata xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:opf='http://www.idpf.org/2007/opf' xmlns:dcterms='http://purl.org/dc/terms/' xmlns:calibre='http://calibre.kovidgoyal.net/2009/metadata' xmlns:dc='http://purl.org/dc/elements/1.1/'>\n\
			<dc:language>vi</dc:language>\n\
			<dc:title>"+book_info["book_name"]+"</dc:title>\n\
			<dc:creator opf:file-as='Tran Thao Nguyen' opf:role='aut'>Trần Thảo Nguyên</dc:creator>\n\
			<meta name='cover' content='cover'/>\n\
			<meta name='calibre:title_sort' content='"+book_info["book_name"]+"'/>\n\
			<dc:date>0101-01-01T00:00:00+00:00</dc:date>\n\
			<dc:contributor opf:role='bkp'></dc:contributor>\n\
			<dc:identifier id='uuid_id' opf:scheme='uuid'>0c159d12-f5fe-4323-8194-f5c652b89f5c</dc:identifier>\n\
		</metadata>\n\
		<manifest>\n\
	"+content_item_1+"\n\
			<item id='ncx' href='toc.ncx' media-type='application/x-dtbncx+xml'/>\n\
			<item id='stylesheet.css' href='stylesheet.css' media-type='text/css'/>\n\
			<item id='cover' href='cover.jpg' media-type='image/jpeg'/>\n\
		</manifest>\n\
		<spine toc='ncx'>\n\
	"+content_item_2+"\n\
		</spine>\n\
		<guide>\n\
		</guide>\n\
	</package>";

	container_file = "<?xml version='1.0' encoding='UTF-8'?>\n\
	<container version='1.0' xmlns='urn:oasis:names:tc:opendocument:xmlns:container'>\n\
	<rootfiles>\n\
	<rootfile full-path='content.opf' media-type='application/oebps-package+xml'/>\n\
	</rootfiles>\n\
	</container>";

	css_file = ".header {\n\
		font-size: 100%;\n\
		font-weight: bold;\n\
		margin: 0 0 5px;\n\
		text-transform: uppercase;\n\
		text-align: center;\n\
		color: #73562D;\n\
		text-shadow: 0px 0px 1px #000;\n\
	}\n\
	.BOOK_NAME {\n\
		font-size: 80%;\n\
		text-align: center;\n\
		color: #8c8e6f;\n\
		text-shadow: 0px 0px 1px #8c8e6f;\n\
	}\n\
	.author {\n\
		font-size: 80%;\n\
		text-align: center;\n\
		color: #8c8e6f;\n\
		text-shadow: 0px 0px 1px #8c8e6f;\n\
	}\n\
	.chap, .part {\n\
		font-size: 90%;\n\
		font-weight: bold;\n\
		text-align: center;\n\
		text-shadow: 0px 0px 1px #000;\n\
	}\n\
	.tho {\n\
		font-style: italic;\n\
		margin-top: -0.5em;\n\
		font-size: 85%;\n\
	}\n\
	h4 {\n\
		text-align: center;\n\
		color: #666633;\n\
		text-shadow: 0px 0px 1px #000;\n\
	}\n\
	h5{\n\
		text-align: center;\n\
		color: #666633;\n\
	}\n\
	p {\n\
		text-indent: 14pt;\n\
		line-height: 140%;\n\
		font-size: 100%;\n\
	}\n\
	.ebook {\n\
		color: #888;\n\
		font-style: italic;\n\
		font-size: 75%;\n\
		text-align: right;\n\
	}\n\
	.lv1 {\n\
		font-size: 100%;\n\
		font-weight: bold;\n\
		line-height: 90%;\n\
		text-indent: 14pt;\n\
		margin-left: 0em;\n\
	}\n\
	.lv2 {\n\
		line-height: 100%;\n\
		text-indent: 12pt;\n\
		font-size: 80%;\n\
		font-weight: bold;\n\
		margin-left: 2em;\n\
	}\n\
	a {\n\
		color: #666633;\n\
	}\n\
	.drop {\n\
		font-size: 100%;\n\
		font-weight: bold;\n\
	}";


	let zip = new JSZip();
	let text = zip.folder("text");
	for (let i =0;i<list_chap_html.length;i++){
		text.file(list_chap_html[i]["file_name"],list_chap_html[i]["text"])
	}
	let container = zip.folder("META-INF")
	container.file("container.xml",container_file);
	zip.file("content.opf",content_file);
	zip.file("toc.ncx",toc_file);
	zip.file("stylesheet.css",css_file);
    // zip.file("cover.jpg", book_info["book_cov"], {base64: true});
	zip.generateAsync({type:"blob"})
	.then(function(content) {
		// see FileSaver.js
		saveAs(content, book_info["book_name"].replaceAll(":","_").replaceAll("/","_").replaceAll("\\","_").replaceAll("-","_").replaceAll("?","_").replaceAll(".","_").replaceAll("~","_").replaceAll("|","_")+ ".epub");
	});
}


