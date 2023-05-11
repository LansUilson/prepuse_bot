const texts = require('../../../config/text.json');
const { format } = require('../../../methods.js');
const kb = require('../../../keyboards.js');

module.exports = class {

	hears = [
		"stats", "stat", "statistics"
	];

	handler = async (ctx) => {

		const perSolv = this.db.students[ctx.from.id].totalSolv ? (this.db.students[ctx.from.id].rightSolv/this.db.students[ctx.from.id].totalSolv * 100).toFixed(1) : 0;

		var text = await format(texts.stats, {
			"exam": await format(this.db.students[ctx.from.id].exam, [], 'exam'),
			"subjectList": await format('', this.db.students[ctx.from.id].subjects, 'subjectListMenu'),
			"gSolv": this.db.students[ctx.from.id].gSolv,
			"totalSolv": this.db.students[ctx.from.id].totalSolv,
			"perSolv": perSolv
		}, 'objStr');

		var keyboard = kb.menu.backMenu;

		return await ctx.editMessageText(
			text,
			{
				parse_mode:'Markdown',
				...keyboard
			}
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.command(this.hears, this.handler);
		bot.action(this.hears, this.handler);
	};

};