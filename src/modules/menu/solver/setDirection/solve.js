const texts = require('../../../../config/text.json');
const kb = require('../../../../keyboards.js');

module.exports = class {

	hears = [
		"goSolve", "solve", "gosolve"
	];

	handler = async (ctx) => {

		if(this.db.users[ctx.from.id].registration != "done" || this.db.users[ctx.from.id].waitingAnswer != "0") { return false };
		
		if(ctx.update.callback_query) {
			return await ctx.editMessageText(
				texts.solve.setDirection,
				kb.solve.setDirection
			);
		};

		return await ctx.telegram.sendMessage(
			ctx.from.id,
			texts.solve.setDirection,
			kb.solve.setDirection
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
		bot.command(this.hears, this.handler);
	};

};