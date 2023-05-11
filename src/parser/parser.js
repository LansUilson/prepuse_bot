const data = require('./sites.json');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const db = require('better-sqlite3')('/home/lans/project/version_4/src/db/exercices.db');
const tasks = require('better-sqlite3')('/home/lans/project/version_4/src/db/tasks.db');

function sdamgiaParser(link, catList) {

	const exercices = axios.post(link + 'prob_catalog')
	 .then(response => {

		var currentPage = response.data;
		const dom = new JSDOM(currentPage);
		var categories = dom.window.document.getElementsByClassName('cat_category');

		var exercices = [];
		for (var category = 1; category < categories.length; category++) {
			if(categories[category].innerHTML.includes('pcat_num')) {

				var number = categories[category].querySelector('span.pcat_num').innerHTML;
				var type = categories[category].querySelector('b').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split('. ')[1];

				if(type == undefined) { 
					var type = categories[category].querySelector('b').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split('.')[1]; 
				};

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

				var number = categories[category].querySelector('b').innerHTML
							  .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split(/(Задания )((Д([0-9]+)?)( .[0-9]+)?)/)[2];
				var type = categories[category].querySelector('b').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split('. ')[1];

				if(type == undefined) { 
					var type = categories[category].querySelector('b').innerHTML.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '').split('.')[1]; 
				};

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

function parseEx() {
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
};

function parseTextsRus() {
	//ege_rus.exec("delete from tasks")

	/*const exercices = axios.post('https://rus-ege.sdamgia.ru/test?filter=all&category_id=289&print=true')
	 .then(response => {

		var currentPage = response.data;
		const dom = new JSDOM(currentPage);
		var texts = dom.window.document.getElementsByClassName('probtext');
		var request = "";

		for (var text = 0; text < texts.length; text++) {

			var txt = texts[text].querySelector('div.pbody').innerHTML.replace(/(<p>|<p[^>]*>|<\/p>)/g, "\n").replace(/(<!--rule_info-->)|<(?!\/?(b|i|s|u)\b)[^>]*>/g, "").replace("'", '"').replace(/	+/g, " ").replace(/\n+/g, "\n").replace(/<!---->(?:(\s+))|(?:(\n))/g, "").replace("(По", "\n(По").replace("*)*", "*)\n*");
			var id = texts[text].getAttribute("data-text_id");

			request += `INSERT INTO texts 
							(id, text, tasks) 
						VALUES (${id}, '${txt}', '1-3');`

		};
		ege_rus.exec(request);
		//console.log(categories[0].getElementsByClassName("probtext").length);
		
				

	});

	axios.post('https://rus-ege.sdamgia.ru/test?filter=all&category_id=229&print=true')
	 .then(response => {

		var currentPage = response.data;
		const dom = new JSDOM(currentPage);
		var texts = dom.window.document.getElementsByClassName('probtext');
		var request = "";

		for (var text = 0; text < texts.length; text++) {

			var txt = texts[text].querySelector('div.pbody').innerHTML.replace(/(<p>|<p[^>]*>|<\/p>)/g, "\n").replace(/(<!--rule_info-->)|<(?!\/?(b|i|s|u)\b)[^>]*>/g, "").replace("'", '"').replace(/	+/g, " ").replace(/\n+/g, "\n").replace(/<!---->(?:(\s+))|(?:(\n))/g, "").replace("(По", "\n(По").replace("*)*", "*)\n*");
			var id = texts[text].getAttribute("data-text_id");

			request += `INSERT OR IGNORE INTO texts 
							(id, text, tasks) 
						VALUES (${id}, '${txt}', '22-27');`

		};
		ege_rus.exec(request);

		//console.log(categories[0].getElementsByClassName("probtext").length);
		
				

	});*/

	const catList = db.prepare("SELECT * FROM ege_rus").all();
	
	for(var category of catList) {
	
		const exercices = axios.post(`https://rus-ege.sdamgia.ru/test?filter=all&category_id=${category.id}&print=true`)
		 .then(response => {

			var currentPage = response.data;
			const dom = new JSDOM(currentPage);

			var request = "";

			var content = dom.window.document.getElementsByClassName('prob_maindiv');
			var number = /Тип (\d+)/.exec(content[0].querySelector('span.prob_nums').innerHTML)[1];

			var texts = dom.window.document.getElementsByClassName('probtext');
			console.log(number)
			if(texts.length != 0) {

				for (var text = 0; text < texts.length; text++) {

					var txt = texts[text].querySelector('div.pbody').innerHTML.replace(/(<p>|<p[^>]*>|<\/p>)/g, "\n").replace(/(<!--rule_info-->)|<(?!\/?(b|i|s|u)\b)[^>]*>/g, "").replace("'", '"').replace(/	+/g, " ").replace(/\n+/g, "\n").replace(/<!---->(?:(\s+))|(?:(\n))/g, "").replace("(По", "\n(По").replace("*)*", "*)\n*");
					var id = texts[text].getAttribute("data-text_id");

					var attach = tasks.prepare(`SELECT * FROM attachable WHERE id = ${id}`).all();
					console.log(id)
					if(attach.length != 0) {
						var tsks = attach[0].tasks.split("-");
						if(parseInt(tsks[0]) > parseInt(number)) {
							tsks[0] = number;
						} else if(parseInt(tsks[1]) < parseInt(number)) {
							tsks[1] = number;
						};

						tasks.exec(`UPDATE attachable SET tasks = '${tsks.join("-")}' WHERE id = ${id}`);
					};

					tasks.exec(`INSERT OR IGNORE INTO attachable 
									(id, subject, content, tasks) 
								VALUES (${id}, 'ege','${txt}', '${number}-${number}');`)

				};

			};

			

			for (var exercise = 0; exercise < content.length; exercise++) {

				var txt = content[exercise].querySelector('div.nobreak').querySelector('div.pbody').innerHTML.replace(/(<p>|<p[^>]*>|<\/p>)/g, "\n").replace(/(<!--rule_info-->)|<(?!\/?(b|i|s|u)\b)[^>]*>/g, "").replace("'", '"').replace(/	+/g, " ").replace("ГРАММАТИЧЕСКИЕ ОШИБКИ", "\n\nГРАММАТИЧЕСКИЕ ОШИБКИ\n").replace("ПРЕДЛОЖЕНИЯ", "\n\nПРЕДЛОЖЕНИЯ\n").replace(/\n+/g, "\n");
			
				var solve = content[exercise].querySelector('div.solution').innerHTML.replace(/(<p>|<p[^>]*>|<\/p>)/g, "\n").replace(/(<!--rule_info-->)|<(?!\/?(b|i|s|u)\b)[^>]*>/g, "").replace("'", '"').replace(/	+/g, " ").replace(/\n+/g, "\n");

				var answer = content[exercise].querySelector('div.answer') === null ? null : content[exercise].querySelector('div.answer').innerHTML.replace(/(<p>|<p[^>]*>|<\/p>)/g, "\n").replace(/(<!--rule_info-->)|<(?!\/?(b|i|s|u)\b)[^>]*>/g, "").replace("'", '"').replace(/	+/g, " ").replace(/\n+/g, "\n").replace("Ответ: ", "");

				var textAttach = content[exercise].querySelector('div.probtext') === null ? null : content[exercise].querySelector('div.probtext').getAttribute("data-text_id");

				request += `INSERT OR IGNORE INTO tasks 
								(number, exam, subject, content, solve, answer, attach) 
							VALUES (${number}, 'ege','rus','${txt}', '${solve}', '${answer}', ${textAttach});`

			};

			tasks.exec(request);
			//console.log(categories[0].getElementsByClassName("probtext").length);
			
					

		});

	};

};
parseTextsRus();
//https://kpolyakov.spb.ru/school/ege/gen.php?action=listCategories