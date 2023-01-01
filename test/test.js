/*const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

axios.defaults.withCredentials = true

const exercices = axios.get("http://80.250.169.4/os/xmodules/qprint/qsearch.php?theme_guid=4BE9873EF46DB209473CFCC27C95FA75&proj_guid=74676951F093A0754D74F2D6E7955F06&groupno=0", {
	'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:105.0) Gecko/20100101 Firefox/105.0'
})
 .then(response => {
	var currentPage = response.data;
	//console.log(currentPage);
	console.log('\n\n\n\n\n');
	var sid = response.headers['set-cookie'].split(";")[0].replace("PHPSESSID=", "");
	console.log(sid);
	const exercices = axios.get("http://80.250.169.4/os/xmodules/qprint/qsearch.php?theme_guid=4BE9873EF46DB209473CFCC27C95FA75&proj_guid=74676951F093A0754D74F2D6E7955F06", {
		'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:105.0) Gecko/20100101 Firefox/105.0',
		'Cookie': '__ddg1_=kxtEfhRCCSWi9fqrf7IS; _ym_uid=1665324379106997168; _ym_d=1665324379; _ym_isad=2; PHPSESSID=ea95a41f3e45af5f12be6a62c143e9e6; md_auto=qprint',// + sid,
		'Host': '80.250.169.4'
	})
	 .then(resp => {
	 	//console.log(resp.data);
	});
	/*const dom = new JSDOM(currentPage);
	var options = dom.window.document.querySelector("span.WalkSelected");
	console.log(options[0]);	
	options.forEach(function(a) {
		console.log(a.innerHTML);
	})
});
*/
var request = require("request");
var url = "http://80.250.169.4/os/xmodules/qprint/qsearch.php?theme_guid=4BE9873EF46DB209473CFCC27C95FA75&proj_guid=74676951F093A0754D74F2D6E7955F06&groupno=0";
request(url, function(err,res,body) {
	console.log(body);
})
