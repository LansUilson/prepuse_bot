const db = require('better-sqlite3')('./blanks.db');
const methods = require('../methods.js');
const data = require('./vars.json');

class Ex1 {
	constructor() {
		this.texts_one = db.prepare('SELECT text FROM "1_texts" WHERE type = 1').all();
		this.texts_two = db.prepare('SELECT text FROM "1_texts" WHERE type = 2').all();
		this.texts_three = db.prepare('SELECT text FROM "1_texts" WHERE type = 3').all();

		this.data = data.ex1;
	};

	generate_random() {
		if(Math.floor(Math.random() * 2) == 0) {
			return this.get_from_base();
		};
		let variations = [{ type: 1, len: this.texts_one.length }, { type: 2, len: this.texts_two.length }, { type: 3, len: this.texts_three.length }];
		let sum = 0;
		for(let i = 0; i < variations.length; i++) {
			sum += variations[i].len;
		};

		let rand = Math.floor(Math.random() * sum);
		let random = 0;
		for(let j = variations[0].len; j <= rand; j += variations[random].len) {
			random++;
		};
		let random_type = variations[random].type;

		if(random_type == 1) { 
			return this.generate_type_one();
		} else if(random_type == 2) {
			return this.generate_type_two();
		} else if(random_type == 3) {
			return this.generate_type_three();
		};
	};

	generate_type_one() {
		let text = this.texts_one[Math.floor(Math.random() * this.texts_one.length)].text;
		let words = text.match(/[A-zА-яёЁ]+, /g);
		let word = words[Math.floor(Math.random() * words.length)];
		let answer = word.replace(', ', '').toLowerCase();

		let encoding = this.data.encodings[Math.floor(Math.random() * this.data.encodings.length)];
		let weight = encoding.weight;
		let baits = word.length * weight / 8;

		let dec = this.data.names[Math.floor(Math.random() * this.data.names.length)];
		let name = dec.name[Math.floor(Math.random() * dec.name.length)];

		let category1 = "";
		let category2 = "";
		if(dec.category == "female"){ 
			category1 = "а";
			category2 = "ца";
		} else {
			category2 = "к";
		};

		let mess = 
`В кодировке ${encoding.name} каждый символ кодируется ${weight} битами. ${name} написал${category1} текст (в нём нет лишних пробелов):

${text}

Учени${category2} вычеркнул${category1} из списка одно слово. Заодно он${category1} вычеркнул${category1} ставшие лишними запятые и пробелы  — два пробела не должны идти подряд.
При этом размер нового предложения в данной кодировке оказался на ${baits} байт(a) меньше, чем размер исходного предложения. Напишите в ответе вычеркнутое слово.`;

		let id = methods.hashCode(mess);
		this.insert(mess, answer, 1, id)

		return [mess, answer, id];
	};

	generate_type_two() {
		let text_orig = this.texts_two[Math.floor(Math.random() * this.texts_two.length)].text;
		let text = text_orig.replace('...', '');
		let words = text.match(/[A-zА-яёЁ]+([A-zА-яёЁ\-.]{5,})/g);
		let word = words[Math.floor(Math.random() * words.length)];
		let answer = word.replace(', ', '').toLowerCase();

		let encoding = this.data.encodings[Math.floor(Math.random() * this.data.encodings.length)];
		let weight = encoding.weight;
		let baits = (word.length + 1) * weight / 8;

		let dec = this.data.names[Math.floor(Math.random() * this.data.names.length)];
		let name = dec.name[Math.floor(Math.random() * dec.name.length)];

		let category1 = "";
		let category2 = "";
		if(dec.category == "female"){ 
			category1 = "а";
			category2 = "ца";
		} else {
			category2 = "к";
		};

		let mess = 
`В кодировке ${encoding.name} каждый символ кодируется ${weight} битами. ${name} хотел${category1} написать текст (в нём нет лишних пробелов):

${text}

Одно из слов учени${category2} написал${category1} два раза подряд, поставив между одинаковыми словами один пробел. При этом размер написанного предложения в данной кодировке оказался на ${baits} байт больше, чем размер нужного предложения. Напишите в ответе лишнее слово.`;

		let id = methods.hashCode(mess);
		this.insert(mess, answer, 2, id)

		return [mess, answer, id];
	};

	generate_type_three() {
		let text_orig = this.texts_three[Math.floor(Math.random() * this.texts_three.length)].text;

		let encoding = this.data.encodings[Math.floor(Math.random() * this.data.encodings.length)];
		let weight = encoding.weight;
		let answer = (text_orig.length * weight) / 8;

		let mess = 
`В одной из кодировок ${encoding.name} каждый символ кодируется ${weight} битами. Определите размер в байтах следующего предложения в данной кодировке: 
${text_orig}`;

		let id = methods.hashCode(mess);
		this.insert(mess, answer, 3, id)

		return [mess, answer, id];
	};

	get_from_base() {
		console.log(123456789);
		let exercises = db.prepare('SELECT * FROM "1_generated"').all();
		let exercise = exercises[Math.floor(Math.random() * exercises.length)];
		return [exercise.text, exercise.answer, exercise.id];
	};

	insert(text, answer, type, id) {
		let select = db.prepare(`SELECT id FROM "1_generated" WHERE type = ${type}`).all().map(element => element.id);
		if(select.includes(id)) {
			return null;
		}
		else { 
			return db.exec(`INSERT INTO \`1_generated\` (\`text\`, \`answer\`, \`type\`, \`id\`) VALUES ('${text}', '${answer}', ${type}, ${id})`);
		};
	};
};
let ex1 = new Ex1();
let maam = ex1.generate_random()
console.log(maam);
