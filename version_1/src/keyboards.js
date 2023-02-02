const { Markup, Router } = require('telegraf');

const startKb = Markup.inlineKeyboard(
	[
		Markup.button.callback('Начнём', 'start'),
	],
);

const choiceKb = Markup.inlineKeyboard(
	[
		Markup.button.callback('ЕГЭ', 'menuEge'),
		Markup.button.callback('ОГЭ', 'menuOge'),
	],
);

const menuKb = Markup.inlineKeyboard([
	[
		Markup.button.callback('Посмотреть статистику', 'stats'),
	],
	[
		Markup.button.callback('Выбрать предмет', 'choiceSub'),
	],
	[
		Markup.button.callback('Настройки', 'settings'),
	],
	[
		Markup.button.callback('« Назад', 'start'),
	],
]);

const choiceSubP1Kb = Markup.inlineKeyboard([
	[
		Markup.button.callback('Математика (База)', 'ex_mathb'),
		Markup.button.callback('Математика (Проф)', 'ex_math'),
	],
	[
		Markup.button.callback('Русский язык', 'ex_rus'),
		Markup.button.callback('Информатика и ИКТ', 'ex_inf'),
	],
	[
		Markup.button.callback('Физика', 'ex_phys'),
		Markup.button.callback('Обществознание', 'ex_soc'),
	],
	[
		Markup.button.callback('Химия', 'ex_chem'),
		Markup.button.callback('Биология', 'ex_bio'),
	],
	[
		Markup.button.callback('»', 'nextPSub'),
	],
	[
		Markup.button.callback('« Назад', 'menu'),
	],
]);

const choiceSubP2Kb = Markup.inlineKeyboard([
	[
		Markup.button.callback('География', 'ex_geo'),
		Markup.button.callback('История', 'ex_hist'),
	],
	[
		Markup.button.callback('Литература', 'ex_lit'),
		Markup.button.callback('Английский язык', 'ex_en'),
	],
	[
		Markup.button.callback('Немецкий язык', 'ex_de'),
		Markup.button.callback('Французский язык', 'ex_fr'),
	],
	[
		Markup.button.callback('Испанский язык', 'ex_sp'),
	],
	[
		Markup.button.callback('«', 'prevPSub'),
	],
	[
		Markup.button.callback('« Назад', 'menu'),
	],
]);


module.exports = {
	startKb,
	choiceKb,
	choiceSubP1Kb,
	choiceSubP2Kb,
	menuKb,
};