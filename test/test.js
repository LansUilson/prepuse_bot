const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const exercices = axios.get("http://80.250.169.4/os/xmodules/qprint/openlogin.php", {
	'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:105.0) Gecko/20100101 Firefox/105.0'
})
 .then(response => {
	var currentPage = response.data;
	var sid = response.headers['set-cookie'].split(";")[0].replace("PHPSESSID=", "");
	console.log(sid);
	const exercices = axios.get("http://80.250.169.4/os/xmodules/qprint/index.php?theme_guid=4BE9873EF46DB209473CFCC27C95FA75&proj_guid=74676951F093A0754D74F2D6E7955F06", {
		'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:105.0) Gecko/20100101 Firefox/105.0',
		'set-cookie': 'PHPSESSID=1380905dee1efeb2524ccf69a5a3fb1c',
		'Host': '80.250.169.4'
	})
	 .then(resp => {
	 	console.log(resp);
	});
	/*const dom = new JSDOM(currentPage);
	var options = dom.window.document.querySelector("span.WalkSelected");
	console.log(options[0]);	
	options.forEach(function(a) {
		console.log(a.innerHTML);
	})*/
});
var a = [1,2,3,4,5];

