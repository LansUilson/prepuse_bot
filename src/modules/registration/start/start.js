const { format, markUser } = require('../../../methods.js');
const texts = require('../../../config/text.json');
const kb = require('../../../keyboards.js');

module.exports = class {

	hears = [
		/start$/g
	]

	handler = async (ctx) => {

		const registration = this.db.users[ctx.from.id].registration;

		if(ctx.hasOwnProperty('match')) {
			this.db.users[ctx.from.id].waitingAnswer = "0";
			this.db.users[ctx.from.id].status = "0";

			await this.db.deleteUser(ctx.from.id);

			return await ctx.editMessageText(
				texts.registration.start,
				kb.registration.start
			);
		};

		if(registration == "name") {

			this.db.users[ctx.from.id].waitingAnswer = "waitName";

			if(this.db.users[ctx.from.id].status == "teacher") {

				return await ctx.telegram.sendMessage(
					ctx.from.id,
					texts.registration.teacher.name,
					kb.registration.name
				);

			} else {

				return await ctx.telegram.sendMessage(
					ctx.from.id,
					texts.registration.student.name,
					kb.registration.name
				);

			};

		} else if(registration == "linkTeacher") {

			if(this.db.users[ctx.from.id].status == "student") {

				this.db.users[ctx.from.id].waitingAnswer = "teacherID";

				return await ctx.telegram.sendMessage(
					ctx.from.id,
					await format(texts.registration.student.linkTeacher, { "userFName": this.db.users[ctx.from.id].name.split(" ")[0] }, 'objStr'),
					kb.registration.linkTeacher
				);

			} else {

				return await ctx.telegram.sendMessage(
					ctx.from.id,
					await format(texts.registration.teacher.id, { "userFName": this.db.users[ctx.from.id].name.split(" ")[0], "userID": ctx.from.id }, 'objStr'),
					{
						parse_mode:'markdown',
						...kb.registration.id
					}
				);

			};

		} else if(registration == "teacherAccept") {

			let teachers = [];

			for(var teacher of this.db.students[ctx.from.id].teachers) {
				await this.db.getUserToAll(teacher);

				teachers.push(await markUser(this.db.users[teacher].name, teacher));
			};

			return await ctx.reply(
				await format(texts.registration.accept.teacherAccept, { "teacherList": teachers }, 'objStr'),
				{
					parse_mode: 'Markdown',
					...kb.registration.teacherAccept
				}
			);

		} else if(registration == "exam") {

			return await ctx.telegram.sendMessage(
				ctx.from.id,
				texts.choice.student.exam,
				kb.choice.exam
			);

		} else if(registration == "choiceSubjects") {

			let keyboard = this.db.users[ctx.from.id].status == "teacher" ? JSON.parse(JSON.stringify(kb.choice.subsP1Teacher)) : JSON.parse(JSON.stringify(kb.choice.subsP1));
			let user = this.db.users[ctx.from.id].status == "teacher" ? this.db.teachers[ctx.from.id] : this.db.students[ctx.from.id];
			let subjects = user.subjects;

			for(var block of keyboard.reply_markup.inline_keyboard.slice(0,-3)) {
				for(var key of block) {
					if(subjects.includes(key.callback_data)) {
						key.callback_data += "_s";
						key.text += " ✅"
					};
				};
			};

			if(this.db.users[ctx.from.id].status != "teacher") {
			
				if(this.db.students[ctx.from.id].exam == "ege") {
			
					if(subjects.includes("ex_mathb")) {
						keyboard.reply_markup.inline_keyboard.unshift([{ text: 'Математика (База) ✅', callback_data: 'ex_mathb' }]);
					} else if(subjects.includes("ex_math")) {
						keyboard.reply_markup.inline_keyboard.unshift([{ text: 'Математика (Профиль) ✅', callback_data: 'ex_math' }]);
					} else {
						keyboard.reply_markup.inline_keyboard.unshift([{ text: 'Математика (База) ✅', callback_data: 'ex_mathb' }]);
					};
			
				};
	
				var text = this.db.students[ctx.from.id].exam == "oge" ? texts.choice.student.oge.subs : texts.choice.student.ege.subs;
				text = await format(text, { 'exam': await format(this.db.students[ctx.from.id].exam, [], 'exam') }, 'objStr');
			} else {
				var text = texts.choice.teacher.subs;
			};

			return await ctx.telegram.sendMessage(
				ctx.from.id,
				text,
				keyboard
			);

		} else if(registration == "done") {

			try {
				if(this.db.users[ctx.from.id].status != "teacher"){ 
					return await ctx.telegram.sendMessage(
						ctx.from.id,
						await format(texts.menu.student.menu, {
							"exam": await format(this.db.students[ctx.from.id].exam, [], 'exam'),
							"subjectList": await format('', this.db.students[ctx.from.id].subjects, 'subjectListMenu'),
							"gSolv": this.db.students[ctx.from.id].gSolv,
							"perSolv": 0
						}, 'objStr'), 
						{
							parse_mode:'Markdown',
							...kb.menu.studentMenu
						}
					);
				} else {
					return await ctx.telegram.sendMessage(
						ctx.from.id,
						await format(texts.menu.teacher.menu, {
							"studentCount": 0,
							"sentVarsCount": 0,
							"gSolv": 0,
							"perSolv": 0
						}, 'objStr'), 
						{
							parse_mode:'Markdown',
							...kb.menu.teacherMenu
						}
					);
				};
			} catch (e) {
				console.error(e);
			};

		} else if(registration == "teacherId") {

			return await ctx.telegram.sendMessage(
				ctx.from.id,
				await format(texts.registration.teacher.id, { "userFName": this.db.users[ctx.from.id].name.split(" ")[0], "userID": ctx.from.id }, 'objStr'),
				{
					parse_mode:'markdown',
					...kb.registration.id
				}
			);

		};

		return await ctx.telegram.sendMessage(
			ctx.from.id,
			texts.registration.start,
			kb.registration.start
		);

	};

	constructor(bot, db) {
		this.db = db;
		bot.start(this.handler);
        bot.action(this.hears, this.handler);
	};

};