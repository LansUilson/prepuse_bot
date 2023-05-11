const { subs, hashCode } = require('../../../../methods.js');
const texts = require('../../../../config/text.json');
const kb = require('../../../../keyboards.js');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const variants = require('better-sqlite3')('/home/lans/project/version_4/src/db/variants.db');

module.exports = class {

	hears = [
		/getAns_(\d+)_(-?\d+)/g
	];

	handler = async (ctx) => {

		const variantID = ctx.match[2];
		const number = ctx.match[1];

		const task = variants.prepare(`SELECT * FROM \`variant_${variantID}\` WHERE number = ${number}`).get();

		var keyboard = JSON.parse(JSON.stringify(kb.solve.backVariant));

		var userAnswer  = '';
		if(task.userAnswer != null) {
			userAnswer = `Твой ответ: ${task.userAnswer}\n`
		};

		var text = `${userAnswer}Балл: ${task.points}/${task.maxPoints}\n\n` + task.text.replace(/&nbsp;/g, "\n") + "\n\n" + task.solve.replace(/&nbsp;/g, "\n");

		keyboard.reply_markup.inline_keyboard.push([ { text: "Назад", callback_data: `variantD_${variantID}` } ]);

		return await ctx.editMessageText(
			text,
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