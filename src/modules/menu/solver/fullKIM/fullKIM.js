const texts = require('../../../../config/text.json');
const { subs } = require('../../../../methods.js');
const kb = require('../../../../keyboards.js');

module.exports = class {

	hears = [
		"fullKIM"
	];

	handler = async (ctx) => {

		if(this.db.users[ctx.from.id].registration != "done" || this.db.users[ctx.from.id].waitingAnswer != "0") { return false };
		
		var keyboard = JSON.parse(JSON.stringify(kb.solve.choiceSubject))
		var num = 0;

		for(var subject of this.db.students[ctx.from.id].subjects) {

			num % 2 == 0 ? keyboard.reply_markup.inline_keyboard.push([ { text: subs[subject.slice(3)], callback_data: "solvF_" + subject.slice(3) } ]) : keyboard.reply_markup.inline_keyboard[keyboard.reply_markup.inline_keyboard.length - 1].push({ text: subs[subject.slice(3)], callback_data: "solvF_" + subject.slice(3) });
			num++;

		};

		keyboard.reply_markup.inline_keyboard.push([ { text: "Назад", callback_data: "goSolve" } ])

		return await ctx.editMessageText(
			texts.solve.choiceSubject,
			keyboard
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};