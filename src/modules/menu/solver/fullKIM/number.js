const { subs, hashCode } = require('../../../../methods.js');
const texts = require('../../../../config/text.json');
const kb = require('../../../../keyboards.js');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const variants = require('better-sqlite3')('./src/db/variants.db');

module.exports = class {

	hears = [
		/number_(\d+)_(-?\d+)/g
	];

	handler = async (ctx) => {
		console.log("123456")

		const variantID = ctx.match[2];
		const number = ctx.match[1];

		const task = variants.prepare(`SELECT * FROM \`variant_${variantID}\` WHERE number = ${number}`).get();

		var keyboard = JSON.parse(JSON.stringify(kb.solve.backVariant));

		keyboard.reply_markup.inline_keyboard.push([ { text: "Назад", callback_data: `variant_${variantID}` } ]);

		if(task.userAnswer != null) {
			task.text = task.text + `\n\nЗаписанный ответ: ${task.userAnswer}`
		};

		this.db.users[ctx.from.id].waitingAnswer = `getAnswer_${variantID}_${number}`;

		return await ctx.editMessageText(
			task.text.replace(/&nbsp;/g, "\n") + "\n\nОтправьте ответ в формате ЕГЭ.",
			{
				parse_mode: "HTML",
				...keyboard
			}
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};