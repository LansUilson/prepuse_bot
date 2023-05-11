const texts = require('../../../../config/text.json');
const { format } = require('../../../../methods.js');
const kb = require('../../../../keyboards.js');

module.exports = class {

	hears = [
		"deleteAccount", "deleteCancel"
	];

	handler = async (ctx) => {

		if(this.db.users[ctx.from.id].registration != "done" || (this.db.users[ctx.from.id].waitingAnswer != "0" && this.db.users[ctx.from.id].waitingAnswer != "deletingAccount")) { return false };
		
		this.db.users[ctx.from.id].waitingAnswer = "deleteAccount";

		return await ctx.editMessageText(
			format(texts.menu.deleteAccount, { "userID": ctx.from.id }, 'objStr'),
			{
				parse_mode:'Markdown',
				...kb.menu.deleteCancel
			}
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};