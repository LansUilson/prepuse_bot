const { subs, hashCode } = require('../../../../methods.js');
const texts = require('../../../../config/text.json');
const kb = require('../../../../keyboards.js');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const variants = require('better-sqlite3')('./src/db/variants.db');

module.exports = class {

	hears = [
		/variant_(-?\d+)/g
	];

	handler = async (ctx) => {
		this.db.users[ctx.from.id].waitingAnswer = 0;

		const variantID = ctx.match[1];

		var keyboard = JSON.parse(JSON.stringify(kb.solve.choiceSubject))

		for(let x = 1; x < 28; x++) {

			if(x % 2 != 0) {

				keyboard.reply_markup.inline_keyboard.push([ { text: `Задание ${x}`, callback_data: `number_${x}_${variantID}` } ]);

			} else {

				keyboard.reply_markup.inline_keyboard[keyboard.reply_markup.inline_keyboard.length-1].push({ text: `Задание ${x}`, callback_data: `number_${x}_${variantID}` });

			};				

		};

		keyboard.reply_markup.inline_keyboard.push([ { text: "Сдать работу", callback_data: `acceptDone_${variantID}` } ]);
		keyboard.reply_markup.inline_keyboard.push([ { text: "Назад", callback_data: "menuCancel" } ]);

		return await ctx.editMessageText(
			texts.solve.rusDone,
			keyboard
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};