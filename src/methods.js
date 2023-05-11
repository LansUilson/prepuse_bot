function format(str='', args=[], what='') {

	if(what == 'exam') {

		if(str == "ege") { 
			return "ЕГЭ";
		} else if(str == "oge") { 
			return "ОГЭ";
		};

	} else if(what == 'subjectListMenu') {

		var str = "";

		for(var subject of args) {
			str += `  - ${subs[subject.slice(3)]}\n`
		};

		return str

	} else if(what == 'tasksPoints') {

		for(var key in args) {
			str += `  Задание ${key}: ${args[key][0]}/${args[key][1]}\n`
		};

		return str;

	} else if(what == 'objStr') {

		for(var key in args) {
			str = str.replace(`%(${key})`, args[key]);
		};

		return str;

	};

};

function markUser(userName, userId) {
	return `[${userName}](tg://user?id=${userId})`
};

function hashCode(string) {
	return Array.from(string)
	 .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
};

function sleep(s) {
	return new Promise(resolve => setTimeout(resolve,s*1000));
};

subs = {
	rus: "Русский язык",
	math: "Математика (Профиль)",
	mathb: "Математика (База)",
	matho: "Математика",
	matht: "Математика",
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

module.exports = {
	format,
	hashCode,
	sleep,
	markUser,
	subs
};