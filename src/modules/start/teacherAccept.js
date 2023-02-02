const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/right/g, /wrong/g
	];

	handler = async (ctx) => {

		if(ctx.match[0] == "right") {
			return await ctx.editMessageText(
				texts.choise.student.exam,
				kb.choise.exam
			);
		} else {
			const teacher = (await this.db.prepare(`SELECT teacher FROM 'students' WHERE id = ${ctx.from.id}`).get()).teacher;
			const students = JSON.parse((await this.db.prepare(`SELECT students FROM 'teachers' WHERE id = ${teacher}`).get()).students);
			students.splice(students.indexOf(ctx.from.id), 1);

			await this.db.exec(`UPDATE 'students' SET teacher = 0 WHERE id = ${ctx.from.id};
								UPDATE 'users' SET waitingAnswer = ('teacherID') WHERE id = ${ctx.from.id};
								UPDATE 'teachers' SET students = ('${JSON.stringify(students)}') WHERE id = ${teacher}`);

			return await ctx.editMessageText(
				texts.start.student.linkTeacher,
				kb.start.linkTeacher
			);
		};

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};