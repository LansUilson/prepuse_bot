const data = require('./sites.json');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const db = require('better-sqlite3')('../../db/exercices.db');

function sdamgiaParser(link, catList) {
	const exercices = axios.post(link + 'prob_catalog')
	 .then(response => {
		console.log("Parsing " + link);
		var currentPage = response.data;
		const dom = new JSDOM(currentPage);
		var categories = dom.window.document.getElementsByClassName('cat_category');
		var exercices = [];
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

function kpolyakovParser(link, catList) {
	const exercices = axios.get(link)
	 .then(response => {
		console.log("Parsing " + link);
		var currentPage = response.data;
		const dom = new JSDOM(currentPage);
		var options = dom.window.document.querySelector('select').querySelectorAll('option');
		var exercices = [];
		options.forEach(function(option) {
			if(option.innerHTML.includes('Задания прошлых лет')) { return };
			var number = option.innerHTML.split(". ")[0];
			var name = option.innerHTML.split(". ")[1];
			var id = option.getAttribute('value');
			const elem = catList.filter(cat => cat.ege_id === id);
			const elemCheck = catList.filter(cat => cat.ege_id === (id-96).toString());
			if(elemCheck.length !== 0) {
				if(elemCheck[0]['title'].replace('ОГЭ: ','').split(' ').slice(0,2).join('+') === name.split(' ').slice(0,2).join('+')) { 
					exercices.push([number, elemCheck[0]['title'], name, parseInt(id-96), elemCheck[0]['id']]); 
				};
			};
			for (var elemNum = 0; elemNum < elem.length; elemNum++) {
				exercices.push([number, elem[elemNum]['title'], name, parseInt(id), elem[elemNum]['id']]);
			};
		});
		return exercices;
	});
	return exercices;
};

const get = axios.get("https://kpolyakov.spb.ru/school/ege/gen.php?action=listCategories")
 .then(resp => {
 	var catList = resp.data;
	Object.keys(data).forEach(function(sub) {
		for (var i = 0; i < data[sub].length; i++) {
			if(data[sub][i].includes('sdamgia')) {
				sdamgiaParser(data[sub][i], catList).then(exercices => {
					db.exec(`DELETE FROM ${sub}`);
					console.log(`Updating table for ${sub}`);
					for(exercice = 0; exercice < exercices.length; exercice++) {
						db.exec(`INSERT INTO ${sub} 
										(number, type, name, id, last_update) 
									VALUES 
										('${exercices[exercice][0]}', '${exercices[exercice][1]}', '${exercices[exercice][2]}', ${exercices[exercice][3]}, '${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}')
						`);
					};
				});
			} else if(data[sub][i].includes('kpolyakov')) {
				kpolyakovParser(data[sub][i], catList).then(exercices => {
					db.exec(`DELETE FROM kp_${sub}`);
					console.log(`Updating table for kp_${sub}`);
					for(exercice = 0; exercice < exercices.length; exercice++) {
						db.exec(`INSERT INTO kp_${sub} 
										(number, type, name, id, last_update, catId) 
									VALUES 
										('${exercices[exercice][0]}', '${exercices[exercice][1]}', '${exercices[exercice][2]}', ${exercices[exercice][3]}, '${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}', '${exercices[exercice][4]}')
						`);
					};
				});
			};
		};
	}, data);
});
//https://kpolyakov.spb.ru/school/ege/gen.php?action=listCategories