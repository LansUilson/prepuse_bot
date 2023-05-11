const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');
const { Markup } = require('telegraf');

subjects = {
	math: "Математика (Профиль) ✅",
	mathb: "Математика (База) ✅",
	matho: "Математика ✅",
	matht: "Математика",
	rus: "Русский язык",
	inf: "Информатика и ИКТ",
	phys: "Физика",
	soc: "Обществознание",
	chem: "Химия",
	bio: "Биология",
	geo: "География",
	hist: "История",
	lit: "Литература",
	en: "Английский язык",
	de: "Немецкий язык",
	fr: "Французский язык",
	sp: "Испанский язык"
};

module.exports = class {

	hears = [
		/ex_([A-Za-z]+)(_s)?$/g
	];

	handler = async (ctx) => {
		console.log(kb.choice.subsP1);

		if(ctx.match[1] == "matho") {

			return null;

		} else if(ctx.match[1].includes("math") && !ctx.match[1].includes("matht")) {

			const callbackQuery = ctx.update.callback_query;

			const newText = callbackQuery.data.endsWith('mathb') ? subjects.math : subjects.mathb;
			const newCallbackData = callbackQuery.data.endsWith('mathb') ? "ex_math" : "ex_mathb";

			var newKeyboard = await ctx.update.callback_query.message.reply_markup.inline_keyboard.map(row =>
				row.map(button => button.callback_data === callbackQuery.data ? Markup.button.callback(newText, newCallbackData) : button)
			);

		} else {

			const callbackQuery = ctx.update.callback_query;
			let subject = callbackQuery.data.endsWith('_s') ? callbackQuery.data.slice(3,-2) : callbackQuery.data.slice(3);

			const newText = callbackQuery.data.endsWith('_s') ? subjects[subject] : subjects[subject] + ' ✅';
			const newCallbackData = callbackQuery.data.endsWith('_s') ? callbackQuery.data.slice(0,-2) : callbackQuery.data + "_s";

			var newKeyboard = await ctx.update.callback_query.message.reply_markup.inline_keyboard.map(row =>
				row.map(button => button.callback_data === callbackQuery.data ? Markup.button.callback(newText, newCallbackData) : button)
			);

		};

		try {
			return await ctx.editMessageText(
				ctx.update.callback_query.message.text, { 
					reply_markup: JSON.stringify({ 
						inline_keyboard: newKeyboard
					}) 
				}
			);
		} catch(e) {};

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};