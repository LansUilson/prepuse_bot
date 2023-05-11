const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		"menu"//, "menuCancel"
	];

	handler = async (ctx) => {

		if(this.db.users[ctx.from.id].registration != "done" || this.db.users[ctx.from.id].waitingAnswer != "0") { return false };
		
		if(this.db.users[ctx.from.id].status == "student"){ 

			const perSolv = this.db.students[ctx.from.id].totalSolv ? (this.db.students[ctx.from.id].rightSolv/this.db.students[ctx.from.id].totalSolv * 100).toFixed(1) : 0;

			var text = await format(texts.menu.student.menu, {
				"exam": await format(this.db.students[ctx.from.id].exam, [], 'exam'),
				"subjectList": await format('', this.db.students[ctx.from.id].subjects, 'subjectListMenu'),
				"gSolv": this.db.students[ctx.from.id].gSolv,
				"totalSolv": this.db.students[ctx.from.id].totalSolv,
				"perSolv": perSolv
			}, 'objStr');

			var keyboard = kb.menu.studentMenu;
				
		} else {

			var text = await format(texts.menu.teacher.menu, {
				"studentCount": this.db.teachers[ctx.from.id].students.length,
				"sentVarsCount": 0,
				"gSolv": 0,
				"perSolv": 0
			}, 'objStr');

			var keyboard = kb.menu.teacherMenu;

		};

		try {

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

		} catch (e) {
			console.error(e);
		};

	};

	constructor(bot, db) {
		this.db = db;
		bot.command(this.hears, this.handler);
		bot.action(this.hears, this.handler);
	};

};