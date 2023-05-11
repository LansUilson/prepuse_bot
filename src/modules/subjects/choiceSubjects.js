const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/choiceSubjects$/g
	];

	additionalCommands = [
		"setsubjects", "setSubjects"
	];

	handler = async (ctx) => {

		if(this.db.users[ctx.from.id].registration == "done" && (this.db.users[ctx.from.id].waitingAnswer == "0" || this.db.users[ctx.from.id].waitingAnswer == "setSubjects")) {

			let user = this.db.users[ctx.from.id].status == "teacher" ? this.db.teachers[ctx.from.id] : this.db.students[ctx.from.id];
			let subjects = user.subjects;

			this.db.users[ctx.from.id].waitingAnswer = "setSubjects";

			if(this.db.users[ctx.from.id].status == "teacher") {

				var keyboard = JSON.parse(JSON.stringify(kb.menu.subsP1Teacher));

				for(var block of keyboard.reply_markup.inline_keyboard) {
					for(var key of block) {
						if(subjects.includes(key.callback_data)) {
							key.callback_data += "_s";
							key.text += " ✅"
						};
					};
				};

				console.log(keyboard.reply_markup.inline_keyboard);

				if(ctx.update.message) {

					return await ctx.telegram.sendMessage(
						ctx.from.id,
						texts.choice.teacher.subs,
						keyboard
					);

				} else if(ctx.update.callback_query.data == "setSubjects") {

					return await ctx.editMessageText(
						texts.choice.teacher.subs,
						keyboard
					);

				};

			};

			var keyboard = JSON.parse(JSON.stringify(kb.menu.subsP1));
			const text = this.db.students[ctx.from.id].exam == "oge" ? texts.choice.student.oge.subs : texts.choice.student.ege.subs;

			for(var block of keyboard.reply_markup.inline_keyboard) {
				for(var key of block) {
					if(subjects.includes(key.callback_data)) {
						key.callback_data += "_s";
						key.text += " ✅"
					};
				};
			};

			this.db.students[ctx.from.id].exam == "oge" ? null : keyboard.reply_markup.inline_keyboard.unshift([{ text: 'Математика (База) ✅', callback_data: 'ex_mathb' }]);

			if(ctx.update.message) {

				return await ctx.telegram.sendMessage(
					ctx.from.id,
					await format(text, { 'exam': await format(this.db.students[ctx.from.id].exam, [], 'exam') }, 'objStr'),
					keyboard
				);

			} else if(ctx.update.callback_query.data == "setSubjects") {

				return await ctx.editMessageText(
					await format(text, { 'exam': await format(this.db.students[ctx.from.id].exam, [], 'exam') }, 'objStr'),
					keyboard
				);

			};

		};

		this.db.users[ctx.from.id].registration = "choiceSubjects";

		return await ctx.editMessageText(
			texts.choice.teacher.subs,
			kb.choice.subsP1Teacher
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action([...this.hears, ...this.additionalCommands], this.handler);
		bot.command(this.additionalCommands, this.handler);
	};

};