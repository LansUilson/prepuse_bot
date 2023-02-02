const ex = require('better-sqlite3')('./src/db/exercices.db');
const db = require('better-sqlite3')('./src/db/users.db');
const { message } = require('telegraf/filters');
const loadModules = require('./modulesLoad');
const texts = require('./config/text.json');
const { Telegraf } = require('telegraf');
const { format } = require('./methods');
const kb = require('./keyboards.js');

const bot = new Telegraf('5776577856:AAHvmZskCnlNi89Fq3FDQWYT5pTwfwOHtZE');

loadModules(bot, db);

bot.on("text", async (ctx) => {

	const user = await db.prepare(`SELECT * FROM 'users' WHERE id = ${ctx.from.id}`).get();

	if(user.waitingAnswer == "teacherID") {
		const re = ctx.message.text.match(/[0-9]+/g);

		if(re != null) {
			const teacher = await db.prepare(`SELECT * FROM 'teachers' WHERE id = ${re[0]}`).get();

			if(teacher == undefined) {
				return await ctx.reply(
					texts.errors.invalidTeacher,
                	kb.start.linkTeacher
				);
			};

			let students = JSON.parse(teacher.students);
			
			if(students.includes(ctx.from.id)) {
				return await ctx.reply(
					texts.errors.studentExsist,
                	kb.start.linkTeacher
				);
			};

			students.push(ctx.from.id)
			await db.exec(`UPDATE 'teachers' SET students = ('${JSON.stringify(students)}') WHERE id = ${re[0]};
						   UPDATE 'students' SET teacher = ('${re[0]}') WHERE id = ${ctx.from.id};
						   UPDATE 'users' SET waitingAnswer = ('0') WHERE id = ${ctx.from.id}`);

			const teacherUsername = (await ctx.telegram.getChat(re[0])).active_usernames[0];
			return await ctx.reply(
				format(texts.start.student.teacherAccept, { "teacherUsername": teacherUsername }),
                {
                	parse_mode: 'Markdown',
                	...kb.start.teacherAccept
                }
			);
		};
	};

});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));