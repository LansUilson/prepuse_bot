const { format, markUser } = require('../../methods.js');
const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		"setteachers", "setTeachers"
	];

	handler = async (ctx) => {

		if(this.db.users[ctx.from.id].status != "student" || this.db.users[ctx.from.id].registration != "done" || (this.db.users[ctx.from.id].waitingAnswer != "0" &&  !["teacherID", "teacherAccept"].includes(this.db.users[ctx.from.id].waitingAnswer))) { return false };

		if(this.db.users[ctx.from.id].waitingAnswer == "teacherAccept") {

			if(this.db.students[ctx.from.id].tempTeachers) {

				let teachers = [];

				for(var teacher of this.db.students[ctx.from.id].tempTeachers) {
					await this.db.getUserToAll(teacher);

					teachers.push(await markUser(this.db.users[teacher].name, teacher));
				};

				return await ctx.reply(
					await format(texts.registration.accept.teacherAccept, { "teacherList": teachers }, 'objStr'),
					{
						parse_mode: 'Markdown',
						...kb.registration.teacherAccept
					}
				);

			};

		};

		this.db.users[ctx.from.id].waitingAnswer = "teacherID";
		
		var text = texts.menu.setTeacher;
		var keyboard = kb.menu.setTeacher;

		if(ctx.update.callback_query) {
			return await ctx.editMessageText(
				text,
				{
					parse_mode:'Markdown',
					...keyboard
				}
			);
		};

		return await ctx.telegram.sendMessage(
			ctx.from.id,
			text,
			{
				parse_mode:'Markdown',
				...keyboard
			}
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
		bot.command(this.hears, this.handler);
	};

};