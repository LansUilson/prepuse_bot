const { format, markUser } = require('../../methods.js');
const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/himself$/g
	];

	handler = async (ctx) => {

		this.db.users[ctx.from.id].waitingAnswer = 0;

		if(this.db.users[ctx.from.id].registration == "done") {

			var teacherList = "";

			for(var teacher of this.db.students[ctx.from.id].teachers) {

				await this.db.getUserToAll(teacher);

				this.db.teachers[teacher].students.splice(this.db.teachers[teacher].students.indexOf(ctx.from.id), 1);

			};

			this.db.students[ctx.from.id].teachers = [];

			var text = await format(texts.menu.student.settings, {
				"userName": this.db.users[ctx.from.id].name,
				"exam": await format(this.db.students[ctx.from.id].exam, [], 'exam'),
				"subjectList": await format('', this.db.students[ctx.from.id].subjects, 'subjectListMenu'),
				"teacherList": teacherList
			}, 'objStr');

			var keyboard = kb.menu.studentSettings;

		} else {
		
			this.db.users[ctx.from.id].registration = "exam";
			this.db.users[ctx.from.id].waitingAnswer = 0;

			var text = texts.choice.student.exam;
			var keyboard = kb.choice.exam;

		};

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
		bot.action(this.hears, this.handler);
	};

};