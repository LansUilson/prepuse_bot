const { format, markUser } = require('../../methods.js');
const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/teachersRight$/g, /teachersWrong$/g
	]

	handler = async (ctx) => {

		if(ctx.match[0] == "teachersRight") {

			this.db.users[ctx.from.id].waitingAnswer = 0;

			if(this.db.users[ctx.from.id].registration == "done") {
				
				if(this.db.students[ctx.from.id].tempTeachers) {

					for(var teacherId of this.db.students[ctx.from.id].tempTeachers) {

						await this.db.getUserToAll(teacherId);

						this.db.teachers[teacherId].students.push(ctx.from.id.toString());
						this.db.students[ctx.from.id].teachers.push(teacherId);

					};

					var teacherList = "";

					if(this.db.students[ctx.from.id].teachers.length != 0) {
						
						const teachers = [];
					
						for(var teacher of this.db.students[ctx.from.id].teachers) {
						
							await this.db.getUserToAll(teacher);
						
							teachers.push(await markUser(this.db.users[teacher].name, teacher));
						
						};

						teacherList = `Привязанные учители: ${teachers.join(", ")}\n`
					};

					var text = await format(texts.menu.student.settings, {
						"userName": this.db.users[ctx.from.id].name,
						"exam": await format(this.db.students[ctx.from.id].exam, [], 'exam'),
						"subjectList": await format('', this.db.students[ctx.from.id].subjects, 'subjectListMenu'),
						"teacherList": teacherList
					}, 'objStr');

					var keyboard = kb.menu.studentSettings;

				} else {

					this.db.users[ctx.from.id].waitingAnswer = "teacherID";

					var text = texts.errors.tempTeachersNE + texts.menu.setTeacher;
					var keyboard = kb.menu.setTeacher;

				};

			} else {

				this.db.users[ctx.from.id].registration = "exam";

				for(var teacherId of this.db.students[ctx.from.id].teachers) {

					await this.db.getUserToAll(teacherId);

					this.db.teachers[teacherId].students.push(ctx.from.id.toString());

				};

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

		} else {

			if(this.db.users[ctx.from.id].registration == "done") {

				this.db.students[ctx.from.id].tempTeachers = [];
				this.db.users[ctx.from.id].waitingAnswer = "teacherID";

				return await ctx.editMessageText(
					texts.menu.setTeacher,
					{
						parse_mode:'Markdown',
						...kb.menu.setTeacher
					}
				);

			};

			this.db.students[ctx.from.id].teachers = [];
			this.db.users[ctx.from.id].waitingAnswer = "teacherID";
			this.db.users[ctx.from.id].registration = "linkTeacher";

			return await ctx.editMessageText(
				await format(texts.registration.student.linkTeacher, { "userFName": this.db.users[ctx.from.id].name.split(" ")[0] }, 'objStr'),
				kb.registration.linkTeacher
			);

		};

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};