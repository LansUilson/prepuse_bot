const data = require('./sites.json');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const db = require('better-sqlite3')('./db/exercices');

function parser() {
	function sdamgiaParser(link) {
		const exercices = axios.post(link + 'prob_catalog')
		 .then(response => {
		 	console.log("Parsing " + link);
		 	var currentPage = response.data;
			const dom = new JSDOM(currentPage);
			var categories = dom.window.document.getElementsByClassName('cat_category');
			var exercices = [];
			//console.log(dom.window.document.getElementsByClassName('cat_category')[216].querySelector('b.cat_name').innerHTML);
			//console.log(dom.window.document.getElementsByClassName('cat_category')[1].querySelector('div.cat_children').getElementsByClassName('cat_category')[0].innerHTML);
			for (var category = 1; category < categories.length; category++) {
				if(categories[category].innerHTML.includes('pcat_num')) {
					var number = categories[category].querySelector('span.pcat_num').innerHTML;
					var type = categories[category].querySelector('b').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split('. ')[1];
					if(type == undefined) { var type = categories[category].querySelector('b').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split('.')[1]; };
					if(!categories[category].innerHTML.includes('cat_children')) {
						var id = categories[category].querySelector('a.cat_name').getAttribute('href').split('=').slice(-1)[0];
						exercices.push([number, type, type, id]);
					} else {
						var children = categories[category].querySelector('div.cat_children').getElementsByClassName('cat_category');
						for (var child = 0; child < children.length; child++) {
							var name = children[child].querySelector('a.cat_name').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '');
							var id = children[child].querySelector('a.cat_name').getAttribute('href').split('=').slice(-1)[0];
							exercices.push([number, type, name, id]);
						};
					};
				} else if(categories[category].innerHTML.includes('Задания Д')) {
					var number = categories[category].querySelector('b').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split(/(Задания )((Д([0-9]+)?)( .[0-9]+)?)/)[2];
					var type = categories[category].querySelector('b').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split('. ')[1];
					if(type == undefined) { var type = categories[category].querySelector('b').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split('.')[1]; };
					if(!categories[category].innerHTML.includes('cat_children')) {
						var id = categories[category].querySelector('a.cat_name').getAttribute('href').split('=').slice(-1)[0];
						exercices.push([number, type, type, id]);
					} else {
						var children = categories[category].querySelector('div.cat_children').getElementsByClassName('cat_category');
						for (var child = 0; child < children.length; child++) {
							var name = children[child].querySelector('a.cat_name').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '');
							var id = children[child].querySelector('a.cat_name').getAttribute('href').split('=').slice(-1)[0];
							exercices.push([number, type, name, id]);
						};
					};
				};
			};
			return exercices;
		 });
		 return exercices;
	};

	Object.keys(data).forEach(function(sub) {
		for (var i = 0; i < data[sub].length; i++) {
			if(data[sub][i].includes('sdamgia')) {
				sdamgiaParser(data[sub][i]).then(exercices => {
					db.exec(`DELETE FROM ege_${sub}`)
					console.log(`Getting ${sub}`);
					for(exercice = 0; exercice < exercices.length; exercice++) {
						//console.log(exercices[exercice]);
						db.exec(`INSERT INTO ege_${sub} 
										(number, type, name, id, last_update) 
									VALUES 
										('${exercices[exercice][0]}', '${exercices[exercice][1]}', '${exercices[exercice][2]}', ${exercices[exercice][3]}, '${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}')
						`);
					};
				});
			};
		};
	}, data);
};

parser();