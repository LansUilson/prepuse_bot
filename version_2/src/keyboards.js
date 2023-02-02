const { Markup, Router } = require('telegraf');

class startKb {

	start = Markup.inlineKeyboard(
		[
			Markup.button.callback('Начнём!', 'start'),
		],
	);

};

class choiseKb {

	exam = Markup.inlineKeyboard(
		[
			Markup.button.callback('ЕГЭ', 'ege'),
			Markup.button.callback('ОГЭ', 'oge'),
		],
	);

	subsP1 = Markup.inlineKeyboard([
		[
			Markup.button.callback('Математика (База) ✅', 'ex_mathb'),
		],
		[
			Markup.button.callback('Информатика и ИКТ', 'ex_inf'),
			Markup.button.callback('Физика', 'ex_phys'),
		],
		[
			Markup.button.callback('Обществознание', 'ex_soc'),
			Markup.button.callback('Химия', 'ex_chem'),
		],
		[
			Markup.button.callback('Биология', 'ex_bio'),
			Markup.button.callback('География', 'ex_geo'),
		],
		[
			Markup.button.callback('Следующая страница', 'nextPSubs'),
		],
		[
			Markup.button.callback('Предметы выбраны!', 'doneSubs'),
		],
		[
			Markup.button.callback('Назад', 'start'),
		],
	]);

	subsP2 = Markup.inlineKeyboard([
		[
			Markup.button.callback('История', 'ex_hist'),
			Markup.button.callback('Литература', 'ex_lit'),
		],
		[
			Markup.button.callback('Английский язык', 'ex_en'),
			Markup.button.callback('Немецкий язык', 'ex_de'),
		],
		[
			Markup.button.callback('Французский язык', 'ex_fr'),
			Markup.button.callback('Испанский язык', 'ex_sp'),
		],
		[
			Markup.button.callback('Предыдущая страница', 'prevPSubs'),
		],
		[
			Markup.button.callback('Предметы выбраны!', 'doneSubs'),
		],
		[
			Markup.button.callback('Назад', 'start'),
		],
	]);

};

let start = new startKb();
let choise = new choiseKb();

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


module.exports = {
	start,
	choise,
	menuKb,
};