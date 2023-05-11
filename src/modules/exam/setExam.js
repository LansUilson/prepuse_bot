const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		"setexam", "setExam"
	];

	handler = async (ctx) => {

		if(this.db.users[ctx.from.id].status != "student" && this.db.users[ctx.from.id].registration != "done" || (this.db.users[ctx.from.id].waitingAnswer != "0" && this.db.users[ctx.from.id].waitingAnswer != "setExam")) { return false };

		this.db.users[ctx.from.id].waitingAnswer = "setExam";
		this.db.students[ctx.from.id].subjects = ["ex_rus"];

		if(ctx.update.message) {

			return await ctx.telegram.sendMessage(
				ctx.from.id,
				texts.menu.setExam,
				kb.choice.exam
			);

		} else if(ctx.update.callback_query.data == "setExam") {

			return await ctx.editMessageText(
				texts.menu.setExam,
				kb.choice.exam
			);

		};

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
		bot.command(this.hears, this.handler);
	};

};