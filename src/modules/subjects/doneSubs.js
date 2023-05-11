const { format, sleep, markUser } = require('../../methods.js');
const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/doneSubs$/g
	];

	handler = async (ctx) => {

		await sleep(0.5);

		const message = ctx.update.callback_query.message;
		const inline = message.reply_markup.inline_keyboard;

		let user = this.db.users[ctx.from.id].status == "teacher" ? this.db.teachers[ctx.from.id] : this.db.students[ctx.from.id];
		let subjects = user.subjects;

		for(var block of inline) {
			for(var key of block) {

				if(key.callback_data.endsWith("_s")) {

					if(!subjects.includes(key.callback_data.slice(0,-2))){
						subjects.push(key.callback_data.slice(0,-2));
					};

				} else if(!key.callback_data.endsWith("_s") && subjects.includes(key.callback_data)) {
					subjects.splice(subjects.indexOf(key.callback_data), 1);
				};

			};
		};

		if(this.db.users[ctx.from.id].status != "teacher") {

			if(this.db.students[ctx.from.id].exam == "oge") {
				subjects.includes("ex_matho") ? null : subjects.push("ex_matho");
			} else {

				if(inline[0][0].callback_data == "ex_mathb" && subjects.includes("ex_math")) {
					subjects.splice(subjects.indexOf("ex_math"), 1);
					subjects.push("ex_mathb");
				} else if(inline[0][0].callback_data == "ex_math" && subjects.includes("ex_mathb")) {
					subjects.splice(subjects.indexOf("ex_mathb"), 1);
					subjects.push("ex_math");
				} else if(subjects.includes("ex_mathb") == subjects.includes("ex_math")) {
					subjects.push(inline[0][0].callback_data);
				};

			};

		};

		subjects = Array.from(new Set(subjects.map(subject => subject.endsWith("_s") ? subject.slice(0,-2) : subject))); // Доп. проверка на баг (если человек будет очень быстро и много нажимать на кнопки, то в список могут попасть предметы с припиской _s)

		if(this.db.users[ctx.from.id].registration == "done") {

			this.db.users[ctx.from.id].waitingAnswer = 0;

			if(this.db.users[ctx.from.id].status == "teacher") { 

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

			} else {

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

			this.db.users[ctx.from.id].registration = "done";

			if(this.db.users[ctx.from.id].status != "teacher") { 

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
					"studentCount": 0,
					"sentVarsCount": 0,
					"gSolv": 0,
					"perSolv": 0
				}, 'objStr');
				
				var keyboard = kb.menu.teacherMenu;

			};

		};

		try {
			return await ctx.editMessageText(
				text, 
				{
					parse_mode:'Markdown',
					...keyboard
				}
			);
		} catch (e) {};
	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};