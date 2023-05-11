const texts = require('../../config/text.json');
const { sleep } = require('../../methods');
const kb = require('../../keyboards.js');

module.exports = class {

	hears = [
		/prevPSubs$/g, /nextPSubs$/g
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

		if(ctx.match[0] == "nextPSubs") {
			if(this.db.users[ctx.from.id].registration != "done") {
				var keyboard = this.db.users[ctx.from.id].status == "teacher" ? JSON.parse(JSON.stringify(kb.choice.subsP2Teacher)) : JSON.parse(JSON.stringify(kb.choice.subsP2));
			} else {
				var keyboard = this.db.users[ctx.from.id].status == "teacher" ? JSON.parse(JSON.stringify(kb.menu.subsP2Teacher)) : JSON.parse(JSON.stringify(kb.menu.subsP2));
			};
			var p1 = false;
		} else {
			if(this.db.users[ctx.from.id].registration != "done") {
				var keyboard = this.db.users[ctx.from.id].status == "teacher" ? JSON.parse(JSON.stringify(kb.choice.subsP1Teacher)) : JSON.parse(JSON.stringify(kb.choice.subsP1));
			} else {
				var keyboard = this.db.users[ctx.from.id].status == "teacher" ? JSON.parse(JSON.stringify(kb.menu.subsP1Teacher)) : JSON.parse(JSON.stringify(kb.menu.subsP1));
			};
			var p1 = true;
		};

		if(this.db.users[ctx.from.id].registration == "done" && this.db.users[ctx.from.id].waitingAnswer == "setExam") {
			keyboard.reply_markup.inline_keyboard.push([{ text: 'Назад', callback_data: 'examCan' }]);
		};

		for(var block of keyboard.reply_markup.inline_keyboard) {
			for(var key of block) {
				if(subjects.includes(key.callback_data)) {
					key.callback_data += "_s";
					key.text += " ✅"
				};
			};
		};

		if(this.db.users[ctx.from.id].status != "teacher") {

			if(this.db.students[ctx.from.id].exam == "ege" && p1) {
				subjects.includes("ex_mathb") ? keyboard.reply_markup.inline_keyboard.unshift([{ text: 'Математика (База) ✅', callback_data: 'ex_mathb' }]) : keyboard.reply_markup.inline_keyboard.unshift([{ text: 'Математика (Профиль) ✅', callback_data: 'ex_math' }]);
			};

		};

		try {
			return await ctx.editMessageText(
				ctx.update.callback_query.message.text, keyboard
			);
		} catch(e) {};

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};