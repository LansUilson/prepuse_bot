const texts = require('../../../config/text.json');
const { format } = require('../../../methods.js');
const kb = require('../../../keyboards.js');

module.exports = class {

	hears = [
		/teacherId$/g
	]

	handler = async (ctx) => {

			this.db.users[ctx.from.id].registration = "teacherId";
			this.db.teachers[ctx.from.id].subjects = [];

			return await ctx.editMessageText(
				await format(texts.registration.teacher.id, { "userFName": this.db.users[ctx.from.id].name.split(" ")[0], "userID": ctx.from.id }, 'objStr'),
				{
					parse_mode:'markdown',
					...kb.registration.id
				}
			);


	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};