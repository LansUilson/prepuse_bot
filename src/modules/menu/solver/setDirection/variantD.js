const texts = require('../../../../config/text.json');
const { format } = require('../../../../methods.js');
const kb = require('../../../../keyboards.js');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const variants = require('better-sqlite3')('/home/lans/project/version_4/src/db/variants.db');

module.exports = class {

	hears = [
		/variantD_(-?\d+)/g
	];

	handler = async (ctx) => {

		const variantID = ctx.match[1];

		const variant = await variants.prepare(`SELECT * FROM \`variant_${variantID}\``).all();

		let points = 0;
		var maxPoints = 0;
		var taskPoints = {};

		for(var task of variant) {

			points += task.points;
			maxPoints += task.maxPoints;
			taskPoints[task.number] = [task.points, task.maxPoints];

		};

		const secondPoints = await variants.prepare(`SELECT second FROM points WHERE first = ${points}`).get().second;

		var keyboard = JSON.parse(JSON.stringify(kb.solve.choiceSubject))

		for(let x = 1; x < 28; x++) {

			if(x % 2 != 0) {

				keyboard.reply_markup.inline_keyboard.push([ { text: `Задание ${x}`, callback_data: `getAns_${x}_${variantID}` } ]);

			} else {

				keyboard.reply_markup.inline_keyboard[keyboard.reply_markup.inline_keyboard.length-1].push({ text: `Задание ${x}`, callback_data: `getAns_${x}_${variantID}` });

			};				

		};

		keyboard.reply_markup.inline_keyboard.push([ { text: "Всё понятно", callback_data: "menu" } ]);

		return await ctx.editMessageText(
			await format(texts.solve.done, { "firstPoints": points, "totalFirstPoints": maxPoints, "secondPoints": secondPoints, "totalSecondPoints": 100, "tasksPoints": await format('', taskPoints, 'tasksPoints') }, 'objStr'),
			keyboard
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};