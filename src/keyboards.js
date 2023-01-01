const { Markup, Router } = require('telegraf');

const startKb = Markup.inlineKeyboard(
	[
   		Markup.button.callback('Начнём', 'start'),
	],
);

const choiceKb = Markup.inlineKeyboard(
	[
   		Markup.button.callback('ЕГЭ', 'ege'),
   		Markup.button.callback('ОГЭ', 'oge'),
	],
);

const choiceSubP1Kb = Markup.inlineKeyboard([
	[
   		Markup.button.callback('Математика (База)', 'rus'),
   		Markup.button.callback('Математика (Проф)', 'oge'),
	],
	[
   		Markup.button.callback('Русский язык', 'ege'),
   		Markup.button.callback('Информатика и ИКТ', 'oge'),
	],
	[
   		Markup.button.callback('Физика', 'ege'),
   		Markup.button.callback('Обществознание', 'ege'),
	],
	[
   		Markup.button.callback('Химия', 'oge'),
   		Markup.button.callback('Биология', 'ege'),
	],
	[
   		Markup.button.callback('»', 'nextPSub'),
	],
	[
   		Markup.button.callback('« Назад', 'start'),
	],
]);

const choiceSubP2Kb = Markup.inlineKeyboard([
	[
   		Markup.button.callback('География', 'oge'),
   		Markup.button.callback('История', 'ege'),
	],
	[
   		Markup.button.callback('Литература', 'oge'),
   		Markup.button.callback('Английский язык', 'ege'),
	],
	[
   		Markup.button.callback('Немецкий язык', 'oge'),
   		Markup.button.callback('Французский язык', 'ege'),
	],
	[
   		Markup.button.callback('Испанский язык', 'oge'),
	],
	[
   		Markup.button.callback('«', 'prevPSub'),
	],
	[
   		Markup.button.callback('« Назад', 'start'),
	],
]);


module.exports = {
	startKb,
	choiceKb,
	choiceSubP1Kb,
	choiceSubP2Kb,
};