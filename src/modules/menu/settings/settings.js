const { format, markUser } = require('../../../methods.js');
const texts = require('../../../config/text.json');
const kb = require('../../../keyboards.js');

module.exports = class {

	hears = [
		"settings", "setting"
	];

	additionalHears = [
		"settingsCancel"
	];

	handler = async (ctx) => {

		if(this.db.users[ctx.from.id].registration != "done" || this.db.users[ctx.from.id].waitingAnswer != "0") { return false };
		
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

				studentList = `Привязанные ученики: ${students}\n`
			};

			var text = await format(texts.menu.teacher.settings, {
				"userName": this.db.users[ctx.from.id].name,
				"subjectList": await format('', this.db.teachers[ctx.from.id].subjects, 'subjectListMenu'),
				"studentList": studentList
			}, 'objStr');

			var keyboard = kb.menu.teacherSettings;

		};

		try {

			if(ctx.match) {
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
		bot.action([...this.hears, ...this.additionalHears], this.handler);
	};

};