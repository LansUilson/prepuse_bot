const { Markup, Router } = require('telegraf');

class registrationKb {

	start = Markup.inlineKeyboard(
		[
			Markup.button.callback('Я ученик', 'student'),
			Markup.button.callback('Я учитель', 'teacher'),
		],
	);

	name = Markup.inlineKeyboard([
		[
			Markup.button.callback('Скопировать с Telegram', 'copyFromTg'),
		],
		[
			Markup.button.callback('Назад', 'start'),
		]
	]);

	id = Markup.inlineKeyboard([
		[
			Markup.button.callback('Далее', 'choiceSubjects'),
		],
		[
			Markup.button.callback('Назад', 'name'),
		],
	]);

	linkTeacher = Markup.inlineKeyboard([
		[
			Markup.button.callback('Я сам по себе', 'himself'),
		],
		[
			Markup.button.callback('Назад', 'name'),
		],
	]);

	teacherAccept = Markup.inlineKeyboard([
		[
			Markup.button.callback('Верно', 'teachersRight'),
		],
		[
			Markup.button.callback('Ввести заново', 'teachersWrong'),
		],
	]);

	nameAccept = Markup.inlineKeyboard([
		[
			Markup.button.callback('Всё правильно', 'nameRight'),
		],
		[
			Markup.button.callback('Ввести заново', 'nameWrong'),
		],
	]);

};

class choiceKb {

	exam = Markup.inlineKeyboard(
		[
			Markup.button.callback('ЕГЭ', 'examEge'),
			Markup.button.callback('ОГЭ', 'examOge'),
		],
	);

	subsP1 = Markup.inlineKeyboard([
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
			Markup.button.callback('Назад', 'exam'),
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
			Markup.button.callback('Назад', 'exam'),
		],
	]);

	subsP1Teacher = Markup.inlineKeyboard([
		[
			Markup.button.callback('Математика', 'ex_matht'),
			Markup.button.callback('Русский язык', 'ex_rus'),
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
			Markup.button.callback('Назад', 'teacherId'),
		],
	]);

	subsP2Teacher = Markup.inlineKeyboard([
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
			Markup.button.callback('Назад', 'teacherId'),
		],
	]);

};

class menuKb {

	setName = Markup.inlineKeyboard([
		[
			Markup.button.callback('Скопировать с Telegram', 'copyFromTg'),
		],
		[
			Markup.button.callback('Отмена', 'settingsCancel'),
		]
	]);

	setTeacher = Markup.inlineKeyboard([
		[
			Markup.button.callback('Я сам по себе', 'himself'),
		],
		[
			Markup.button.callback('Отмена', 'settingsCancel'),
		],
	]);

	studentMenu = Markup.inlineKeyboard([
		[
			Markup.button.callback('Статистика', 'stats'),
		],
		[
			Markup.button.callback('Уведомления', 'notifications'),
		],
		[
			Markup.button.callback('Решать задания', 'goSolve'),
			Markup.button.callback('Задания от учителей', 'varFromTeachers'),
		],
		[
			Markup.button.callback('Настройки', 'settings'),
		]
	]);

	teacherMenu = Markup.inlineKeyboard([
		[
			Markup.button.callback('Статистика учеников', 'stidentsStats'),
		],
		[
			Markup.button.callback('Уведомления', 'notifications'),
		],
		[
			Markup.button.callback('Составитель вариантов', 'composeVar'),
			Markup.button.callback('Отправленные варианты', 'sentVars'),
		],
		[
			Markup.button.callback('Настройки', 'settings'),
		]
	]);

	studentSettings = Markup.inlineKeyboard([
		[
			Markup.button.callback('Изменить имя и фамилию', 'setName'),
		],
		[
			Markup.button.callback('Перепривязать учителей', 'setTeachers'),
		],
		[
			Markup.button.callback('Сменить экзамен', 'setExam'),
			Markup.button.callback('Сменить предметы', 'setSubjects'),
		],
		[
			Markup.button.callback('Удалить аккаунт', 'deleteAccount'),
		],
		[
			Markup.button.callback('В меню', 'menu'),
		]
	]);

	teacherSettings = Markup.inlineKeyboard([
		[
			Markup.button.callback('Изменить имя и фамилию', 'setName'),
			Markup.button.callback('Сменить предметы', 'setSubjects'),
		],
		[
			Markup.button.callback('Отвязать учеников', 'setStudents'),
		],
		[
			Markup.button.callback('Удалить аккаунт', 'deleteAccount'),
		],
		[
			Markup.button.callback('В меню', 'menu'),
		]
	]);

	subsP1 = Markup.inlineKeyboard([
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
		]
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
		]
	]);

	subsP1Teacher = Markup.inlineKeyboard([
		[
			Markup.button.callback('Математика', 'ex_matht'),
			Markup.button.callback('Русский язык', 'ex_rus'),
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
		]
	]);

	subsP2Teacher = Markup.inlineKeyboard([
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
		]
	]);

	deleteCancel = Markup.inlineKeyboard([
		[
			Markup.button.callback('Отмена', 'settingsCancel'),
		]
	]);

	backMenu = Markup.inlineKeyboard([
		[
			Markup.button.callback('В меню', 'menu'),
		]
	]);

};

class solveKb {

	setDirection = Markup.inlineKeyboard([
		[
			Markup.button.callback('Составить полный КИМ', 'fullKIM'),
		],
		[
			Markup.button.callback('Составить из выбранных заданий КИМа', 'compTasks'),
		],
		[
			Markup.button.callback('Составить из выбранных тем', 'compThemes'),
		],
		[
			Markup.button.callback('Прорешивание задания из КИМа', 'compTask'),
		],
		[
			Markup.button.callback('Прорешивание заданий из темы', 'compTheme'),
		],
		[
			Markup.button.callback('В меню', 'menu'),
		]
	]);

	acceptDone = Markup.inlineKeyboard([]);

	accept = Markup.inlineKeyboard([]);

	choiceSubject = Markup.inlineKeyboard([]);

	backVariant = Markup.inlineKeyboard([]);

};

let registration = new registrationKb();
let choice = new choiceKb();
let menu = new menuKb();
let solve = new solveKb();

module.exports = {
	registration,
	choice,
	menu,
	solve,
};