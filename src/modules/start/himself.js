const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/himself/g
	];

	handler = async (ctx) => {

		return await ctx.editMessageText(
			texts.choise.student.exam,
			kb.choise.exam
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};