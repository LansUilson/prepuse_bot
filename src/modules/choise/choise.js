const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/choise/g
	];

	handler = async (ctx) => {

		return await ctx.editMessageText(
			texts.choise.teacher.subs,
			kb.choise.subsP1
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};