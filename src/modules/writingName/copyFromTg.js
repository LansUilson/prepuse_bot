const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/copyFromTg$/g
	];

	handler = async (ctx) => {

		let userName = ctx.from.first_name;

		if(ctx.from.last_name !== undefined) {
			userName += ` ${ctx.from.last_name}`;
		};

		this.db.users[ctx.from.id].name = userName;
		this.db.users[ctx.from.id].waitingAnswer = 0;

		if(this.db.users[ctx.from.id].registration == "done") {

			if(this.db.users[ctx.from.id].status == "student") { 

				var teacherList = "";

				if(this.db.students[ctx.from.id].teachers.length != 0) {
				
					const teachers = [];
				
					for(var teacher of this.db.students[ctx.from.id].teachers) {
				
						await this.db.getUserToAll(teacher);
				
						teachers.push(await markUser(this.db.users[teacher].name, teacher));
				
					};

					teacherList = `Привязанные учители: ${teachers}\n`
				};

				var text = await format(texts.menu.student.settings, {
					"userName": this.db.users[ctx.from.id].name,
					"exam": await format(this.db.students[ctx.from.id].exam, [], 'exam'),
					"subjectList": await format('', this.db.students[ctx.from.id].subjects, 'subjectListMenu'),
					"teacherList": teacherList
				}, 'objStr');

				var keyboard = kb.menu.studentSettings;

			};

		} else {

			if(this.db.users[ctx.from.id].status == "student") {

				this.db.users[ctx.from.id].waitingAnswer = "teacherID";
				this.db.users[ctx.from.id].registration = "linkTeacher";

				var text = await format(texts.registration.student.linkTeacher, { "userFName": this.db.users[ctx.from.id].name.split(" ")[0] }, 'objStr');
				var keyboard = kb.registration.linkTeacher;

			} else {

				this.db.users[ctx.from.id].registration = "teacherId";

				var text = await format(texts.registration.teacher.id, { "userFName": this.db.users[ctx.from.id].name.split(" ")[0], "userID": ctx.from.id }, 'objStr');
				
				var keyboard = kb.registration.id;
					
			};
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