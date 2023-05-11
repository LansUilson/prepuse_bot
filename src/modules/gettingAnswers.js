const { format, markUser } = require('../methods.js');
const texts = require('../config/text.json');
const kb = require('../keyboards.js');

const variants = require('better-sqlite3')('./src/db/variants.db');

module.exports = class {

	hears = [
		/^(?!\/).+/
	];

	handler = async (ctx) => {

		const user = this.db.users[ctx.from.id];

		if(user.waitingAnswer == "teacherID") {

			const re = ctx.message.text.match(/\d+/g);

			if(re != null) {

				var undef = [];
				var exists = [];
				var ok = [];
				this.db.students[ctx.from.id].tempTeachers = [];

				for(var id of re) {

					if(!this.db.isTeacherExists(id)) {
						undef.push(id);
						continue;
					};

					await this.db.getUserToAll(id);

					if(this.db.users[ctx.from.id].registration == "done") {

						if(this.db.students[ctx.from.id].tempTeachers.includes(id)) {
							exists.push(await markUser(this.db.users[id].name, id));;
							continue;
						};

						this.db.students[ctx.from.id].tempTeachers.push(id);

					} else {

						if(this.db.students[ctx.from.id].teachers.includes(id)) {
							exists.push(await markUser(this.db.users[id].name, id));;
							continue;
						};

						this.db.students[ctx.from.id].teachers.push(id);

					};

					ok.push(await markUser(this.db.users[id].name, id));
				};

				var response = "";

				if(undef.length != 0) {
					response += await format(texts.errors.invalidTeachers, { "unregisteredTeachers": undef.join(", ") }, 'objStr');
				};

				if(exists.length != 0) {
					response += await format(texts.errors.studentExsist, { "studentExistTeachers": exists.join(", ") }, 'objStr');
				};

				if(ok.length != 0) {

					if(this.db.users[ctx.from.id].registration != "done") {
						this.db.users[ctx.from.id].registration = "teacherAccept";
						this.db.users[ctx.from.id].waitingAnswer = 0;
					} else {
						this.db.users[ctx.from.id].waitingAnswer = "teacherAccept";
					};

					response += await format(texts.registration.accept.teacherAccept, { "teacherList": ok.join(", ") }, 'objStr');

					var keyboard = kb.registration.teacherAccept;

				} else {

					response += texts.errors.tryAgain;

					var keyboard = this.db.users[ctx.from.id].registration != "done" ? kb.registration.linkTeacher : kb.menu.setTeacher;
					
				};

				return await ctx.reply(
					response,
					{
						parse_mode: 'Markdown',
						...keyboard
					}
				);

			};

		} else if(user.waitingAnswer == "waitName") {

			const re = ctx.message.text.match(/([А-яA-z]+)/g);

			if(re != null) {

				const userName = re.join(" ");
				this.db.users[ctx.from.id].waitingAnswer = 0;

				return await ctx.telegram.sendMessage(
					ctx.from.id,
					await format(texts.registration.accept.nameAccept, { "userName": userName }, 'objStr'),
					kb.registration.nameAccept
				);

			};
		} else if(user.waitingAnswer == "deleteAccount") {

			if(ctx.update.message.text == `delete ${ctx.from.id}`) {

				await this.db.deleteStudent(ctx.from.id);
				await this.db.deleteTeacher(ctx.from.id);
				await this.db.deleteUser(ctx.from.id);

				return await ctx.telegram.sendMessage(
					ctx.from.id,
					texts.menu.deleteSunccess
				);

			};

		} else if((user.waitingAnswer.toString()).includes("getAnswer")) {

			const re = user.waitingAnswer.match(/getAnswer_(-?\d+)_(\d+)/);
			const variantID = re[1];
			const number = re[2];

			const answer = ctx.message.text;

			await variants.exec(`UPDATE \`variant_${variantID}\` SET userAnswer = '${answer.toLowerCase().replace(" ", "")}' WHERE number = ${number}`);

			var keyboard = JSON.parse(JSON.stringify(kb.solve.accept));

			keyboard.reply_markup.inline_keyboard.push([ { text: "Всё верно", callback_data: `variant_${variantID}` } ]);
			keyboard.reply_markup.inline_keyboard.push([ { text: "Изменить ответ", callback_data: `number_${number}_${variantID}` } ]);

			return await ctx.telegram.sendMessage(
				ctx.from.id,
				await format(texts.solve.answerWrite, { "taskNumber": number, "userAnswer": answer }, 'objStr'),
				keyboard
			);

		};

	};

	constructor(bot, db) {
		this.db = db;
		bot.hears(this.hears, this.handler);
	};

};
