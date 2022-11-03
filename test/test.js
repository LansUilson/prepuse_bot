const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const exercices = axios.get("http://80.250.169.4/os/xmodules/qprint/qsearch.php?theme_guid=4BE9873EF46DB209473CFCC27C95FA75&proj_guid=74676951F093A0754D74F2D6E7955F06")
 .then(response => {
	var currentPage = response.data;
	console.log(response.data);
	const dom = new JSDOM(currentPage);
	var options = dom.window.document.querySelector("span.WalkSelected");
	console.log(options[0]);	
	options.forEach(function(a) {
		console.log(a.innerHTML);
	})
});
var a = [1,2,3,4,5];

