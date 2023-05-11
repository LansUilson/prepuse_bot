const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/name$/g
	];

	commands = [
		"setname", "setName"
	];

	handler = async (ctx) => {

		if(this.db.users[ctx.from.id].registration == "done" && (this.db.users[ctx.from.id].waitingAnswer = "0" || this.db.users[ctx.from.id].waitingAnswer == "waitName")) {

			this.db.users[ctx.from.id].waitingAnswer = "waitName";

			if(ctx.update.message) {

				return await ctx.telegram.sendMessage(
					ctx.from.id,
					texts.menu.setName,
					kb.menu.setName
				);

			} else if(ctx.update.callback_query.data == "setName") {

				return await ctx.editMessageText(
					texts.menu.setName,
					kb.menu.setName
				);

			};

		};

		this.db.users[ctx.from.id].waitingAnswer = "waitName";
		this.db.users[ctx.from.id].registration = "name";
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

	constructor(bot, db) {
		this.db = db;
		bot.action([...this.hears, ...this.commands], this.handler);
		bot.command(this.commands, this.handler);
	};

};