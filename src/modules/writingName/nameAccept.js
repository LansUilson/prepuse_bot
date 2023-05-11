const { format, markUser } = require('../../methods.js');
const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/nameRight$/g, /nameWrong$/g
	]

	handler = async (ctx) => {

		if(ctx.match[0] == "nameRight") {

			const userName = ctx.update.callback_query.message.text.match(/:(\s*([^.]*))\./)[2];
			this.db.users[ctx.from.id].name = userName;

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

				} else {

					var studentList = "";

					if(this.db.teachers[ctx.from.id].students.length != 0) {
					
						const students = [];
					
						for(var student of this.db.teachers[ctx.from.id].students) {
					
							await this.db.getUserToAll(student);
					
							students.push(await markUser(this.db.users[student].name, student));
					
						};

						teacherList = `Привязанные ученики: ${students}\n`
					};

					var text = await format(texts.menu.teacher.settings, {
						"userName": this.db.users[ctx.from.id].name,
						"subjectList": await format('', this.db.teachers[ctx.from.id].subjects, 'subjectListMenu'),
						"studentList": studentList
					}, 'objStr');

					var keyboard = kb.menu.teacherSettings;
					
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

		} else {

			this.db.users[ctx.from.id].waitingAnswer = "waitName";

			if(this.db.users[ctx.from.id].registration != "done") {

				this.db.users[ctx.from.id].name = "";
				this.db.users[ctx.from.id].registration = "name";


				if(this.db.users[ctx.from.id].status == "teacher") {

					return await ctx.editMessageText(
						texts.registration.teacher.name,
						kb.registration.name
					);

				} else {

					return await ctx.editMessageText(
						texts.registration.student.name,
						kb.registration.name
					);

				};

			} else {

				return await ctx.editMessageText(
					texts.menu.setName,
					kb.menu.setName
				);

			};
	
		};

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};