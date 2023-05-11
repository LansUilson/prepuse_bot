const texts = require('../../../../config/text.json');
const { format } = require('../../../../methods.js');
const kb = require('../../../../keyboards.js');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const variants = require('better-sqlite3')('/home/lans/project/version_4/src/db/variants.db');

module.exports = class {

	hears = [
		/acceptDone_(-?\d+)/g
	];

	handler = async (ctx) => {

		const variantID = ctx.match[1];

		const variant = variants.prepare(`SELECT * FROM \`variant_${variantID}\``).all();
		
		let givedAnswers = 0;

		for(var task of variant) {
			if(task.userAnswer != null) {
				givedAnswers++;
			};
		};

		var keyboard = JSON.parse(JSON.stringify(kb.solve.acceptDone))

		keyboard.reply_markup.inline_keyboard.push([ { text: "Подтвердить", callback_data: `doneVariant_${variantID}` } ]);
		keyboard.reply_markup.inline_keyboard.push([ { text: "Назад", callback_data: `variant_${variantID}` } ]);

		return await ctx.editMessageText(
			await format(texts.solve.acceptDone, { "givedAnswers": givedAnswers, "totalAnswers": variant.length }, 'objStr'),
			keyboard
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};