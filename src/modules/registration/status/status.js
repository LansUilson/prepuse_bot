const texts = require('../../../config/text.json');
const kb = require('../../../keyboards.js');

module.exports = class {

	hears = [
		/teacher$/g, /student$/g, /status$/g
	];

	handler = async (ctx) => {

		this.db.users[ctx.from.id].registration = "name";
		this.db.users[ctx.from.id].waitingAnswer = "waitName";

		if(ctx.match[0] == "status") {

			this.db.users[ctx.from.id].name = "";

			if(this.db.users[ctx.from.id].status == "teacher") {

				return await ctx.editMessageText(
					texts.registration.teacher.name,
					kb.registration.name
				);

			} else {

				return await ctx.editMessageText(
					texts.registration.student.name,
					kb.registration.name
				);

			};

		};

		this.db.users[ctx.from.id].status = ctx.match[0];

		if(ctx.match[0] == "teacher") {

			await this.db.createTeacher(ctx.from.id);

			return await ctx.editMessageText(
				texts.registration.teacher.name,
				kb.registration.name
			);

		} else {

			await this.db.createStudent(ctx.from.id);

			return await ctx.editMessageText(
				texts.registration.student.name,
				kb.registration.name
			);

		};

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};