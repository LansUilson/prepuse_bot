const texts = require('../../../../config/text.json');
const { format } = require('../../../../methods.js');
const kb = require('../../../../keyboards.js');
const levenshtein = require('js-levenshtein');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const variants = require('better-sqlite3')('/home/lans/project/version_4/src/db/variants.db');

module.exports = class {

	hears = [
		/doneVariant_(-?\d+)/g
	];

	handler = async (ctx) => {

		const variantID = ctx.match[1];

		const variant = await variants.prepare(`SELECT * FROM \`variant_${variantID}\``).all();
		const subject = await variants.prepare(`SELECT subject FROM variants WHERE variantID = ${variantID}`).get().subject;
		
		let points = 0;
		var totalAnswers = 0;
		var taskPoints = {};

		taskloop: for(var task of variant) {

			const answers = task.answer.split("|");
			totalAnswers += task.maxPoints;
			for(var answer of answers) {

				if(task.number == 8 && subject == "rus" && task.userAnswer != null) {

					const errors = await levenshtein(task.userAnswer, answer);
					var pointsTemp = 0;

					if(errors == 0) {
						pointsTemp = 3;
					} else if(errors == 1 || errors == 2) {
						pointsTemp = 2;
					} else if(errors == 3 || errors == 4){
						pointsTemp = 1;
					};

					if(pointsTemp > 0) { this.db.students[ctx.from.id].rightSolv++; }

					points += pointsTemp;
					await variants.exec(`UPDATE \`variant_${variantID}\` SET points = ${pointsTemp} WHERE number = 8`);

					taskPoints[8] = [pointsTemp, task.maxPoints];

				} else if(task.number == 26 && subject == "rus" && task.userAnswer != null) {

					const errors = await levenshtein(task.userAnswer, answer);
					var pointsTemp = 0;

					if(errors == 0) {
						pointsTemp = 3;
					} else if(errors == 1) {
						pointsTemp = 2;
					} else if(errors == 2 || errors == 3){
						pointsTemp = 1;
					};

					if(pointsTemp > 0) { this.db.students[ctx.from.id].rightSolv++; }

					points += pointsTemp;
					await variants.exec(`UPDATE \`variant_${variantID}\` SET points = ${pointsTemp} WHERE number = 26`);

					taskPoints[26] = [pointsTemp, task.maxPoints];

				} else {

					if(task.userAnswer == answer) {

						points++;

						await variants.exec(`UPDATE \`variant_${variantID}\` SET points = 1 WHERE number = ${task.number}`);

						taskPoints[task.number] = [1, task.maxPoints];

						this.db.students[ctx.from.id].rightSolv++;

					} else {

						taskPoints[task.number] = [0, task.maxPoints];

					};

				};

				continue taskloop;

			};

		};

		this.db.students[ctx.from.id].totalSolv += variant.length;

		const endDate = await Math.floor(Date.now() / 1000);
		await variants.exec(`UPDATE variants SET endDate = ${endDate}, points = ${points} WHERE variantID = ${variantID}`);

		var keyboard = JSON.parse(JSON.stringify(kb.solve.choiceSubject));

		for(let x = 1; x < 28; x++) {

			if(x % 2 != 0) {

				keyboard.reply_markup.inline_keyboard.push([ { text: `Задание ${x}`, callback_data: `getAns_${x}_${variantID}` } ]);

			} else {

				keyboard.reply_markup.inline_keyboard[keyboard.reply_markup.inline_keyboard.length-1].push({ text: `Задание ${x}`, callback_data: `getAns_${x}_${variantID}` });

			};				

		};

		keyboard.reply_markup.inline_keyboard.push([ { text: "Всё понятно", callback_data: "menu" } ]);

		this.db.students[ctx.from.id].gSolv++;

		const secondPoints = await variants.prepare(`SELECT second FROM points WHERE first = ${points} AND subject = '${subject}'`).get().second;

		return await ctx.editMessageText(
			await format(texts.solve.done, { "firstPoints": points, "totalFirstPoints": totalAnswers, "secondPoints": secondPoints, "totalSecondPoints": 100, "tasksPoints": await format('', taskPoints, 'tasksPoints') }, 'objStr'),
			keyboard
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};