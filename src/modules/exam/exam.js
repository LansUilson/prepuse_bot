const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/exam(Ege|Oge)$/g, "exam", "examCan"
	];

	handler = async (ctx) => {

		if(ctx.match[0] == "exam") {

			this.db.students[ctx.from.id].subjects = ["ex_rus"];

			return await ctx.editMessageText(
				texts.choice.student.exam,
				kb.choice.exam
			);

		} else if(ctx.match[0] == "examCan") {

			this.db.students[ctx.from.id].subjects = ["ex_rus"];

			return await ctx.editMessageText(
				texts.menu.setExam,
				kb.choice.exam
			);

		};

		this.db.students[ctx.from.id].exam = ctx.match[1].toLowerCase();

		if(this.db.users[ctx.from.id].registration != "done") {

			this.db.users[ctx.from.id].registration = "choiceSubjects";

			var keyboard = JSON.parse(JSON.stringify(kb.choice.subsP1));

		} else {

			var keyboard = JSON.parse(JSON.stringify(kb.menu.subsP1));

			keyboard.reply_markup.inline_keyboard.push([{ text: 'Назад', callback_data: 'examCan' }]);

		};

		const text = this.db.students[ctx.from.id].exam == "oge" ? texts.choice.student.oge.subs : texts.choice.student.ege.subs;

		this.db.students[ctx.from.id].exam == "oge" ? null : keyboard.reply_markup.inline_keyboard.unshift([{ text: 'Математика (База) ✅', callback_data: 'ex_mathb' }]);

		return await ctx.editMessageText(
			await format(text, { 'exam': await format(this.db.students[ctx.from.id].exam, [], 'exam') }, 'objStr'),
			keyboard
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};