const exercices = require('better-sqlite3')('./src/db/exercices.db');
const users = require('better-sqlite3')('./src/db/users.db');
const { sleep } = require('../methods');

class Database {
	constructor() { // Создание объектов с учителями, учениками и всеми пользователями
		this.students = {};
		this.teachers = {};
		this.users = {};
	};

	uploadDatabase(dbs = []) { // Занесение изменений в базу данных
		Object.keys(this.students).length ? dbs.push("students") : null; // Проверка на пустоту объекта учащихся
		Object.keys(this.teachers).length ? dbs.push("teachers") : null; // Проверка на пустоту объекта учителей
		Object.keys(this.users).length ? dbs.push("users") : null; // Проверка на пустоту объекта пользователей

		var request = ``;

		console.log(this.students);
		console.log(this.teachers);
		console.log(this.users);

		if(dbs.includes("students")) {
			for(const key in this.students) { // Перебор учащихся
				const student = this.students[key];

				request += `UPDATE 'students' 
							SET 
								exam = '${student.exam}',
								subjects = '${JSON.stringify(student.subjects)}',
								teachers = '${JSON.stringify(student.teachers)}',
								gSolv = ${student.gSolv},
								rightSolv = ${student.rightSolv},
								totalSolv = ${student.totalSolv},
								mathSolv = ${student.mathSolv},
								mathbSolv = ${student.mathbSolv},
								infSolv = ${student.infSolv},
								rusSolv = ${student.rusSolv},
								socSolv = ${student.socSolv},
								enSolv = ${student.enSolv},
								deSolv = ${student.deSolv},
								frSolv = ${student.frSolv},
								spSolv = ${student.spSolv},
								physSolv = ${student.physSolv},
								chemSolv = ${student.chemSolv},
								bioSolv = ${student.bioSolv},
								geoSolv = ${student.geoSolv},
								litSolv = ${student.litSolv},
								histSolv = ${student.histSolv}
							WHERE id = ${student.id};`
			};
		};

		if(dbs.includes("teachers")) {
			for(const key in this.teachers) { // Перебор учителей
				const teacher = this.teachers[key];

				request += `UPDATE 'teachers' 
							SET
								students = '${JSON.stringify(teacher.students)}',
								subjects = '${JSON.stringify(teacher.subjects)}'
							WHERE id = ${teacher.id};`
			};
		};

		if(dbs.includes("users")) {
			for(const key in this.users) { // Перебор пользователей
				const user = this.users[key];

				request += `UPDATE 'users' 
							SET
								status = '${user.status}',
								registration = '${user.registration}',
								name = '${user.name}',
								waitingAnswer = '${user.waitingAnswer}'
							WHERE id = ${user.id};`
			};
		};

		console.log(request);

		users.exec(request); // Запрос к БД

		// Обнуление объектов для экономия памяти
		this.students = {};
		this.teachers = {};
		this.users = {};

		return true;
	};

	deleteUser(usrId) { // Удаление пользователя из таблиц students или teachers
		if(this.isStudentExists(usrId)) {
			return users.exec(`DELETE FROM 'students' WHERE id = ${usrId};`);
		} else if(this.isTeacherExists(usrId)) {
			return users.exec(`DELETE FROM 'teachers' WHERE id = ${usrId};`);
		};

		return "User does not exist";
	};

	getUserToAll(usrId) { // Занесение пользователя в соответствующие объекты
		if(!this.students[usrId]) {
			const student = users.prepare(`SELECT * FROM 'students' WHERE id = ${usrId}`).get();

			if(student !== undefined) {
				this.students[usrId] = student;
				// Парсинг строк teachers и subjects, т.к в БД нет списков и списки передаются как строки
				this.students[usrId].teachers = JSON.parse(this.students[usrId].teachers);
				this.students[usrId].subjects = JSON.parse(this.students[usrId].subjects);
			};
		};

		if(!this.teachers[usrId]) {
			const teacher = users.prepare(`SELECT * FROM 'teachers' WHERE id = ${usrId}`).get();

			if(teacher !== undefined) {
				this.teachers[usrId] = teacher;
				// Парсинг строк students и subjects, т.к в БД нет списков и списки передаются как строки
				this.teachers[usrId].students = JSON.parse(this.teachers[usrId].students);
				this.teachers[usrId].subjects = JSON.parse(this.teachers[usrId].subjects);
			};
		};

		if(!this.users[usrId]) {
			const user = users.prepare(`SELECT * FROM 'users' WHERE id = ${usrId}`).get();
		
			this.users[usrId] = user;
		};
	};

	/* Student block */

	createStudent(studentId) { // Внесение пользователя в таблицу students и в объект
		const student = users.prepare(`SELECT * FROM 'students' WHERE id = ${studentId}`).get();

		if(student !== undefined) {
			this.students[studentId] = student;
			// Парсинг строк teachers и subjects, т.к в БД нет списков и списки передаются как строки
			this.students[studentId].teachers = JSON.parse(this.students[studentId].teachers);
			this.students[studentId].subjects = JSON.parse(this.students[studentId].subjects);

			return student;
		};

		users.exec(`INSERT OR IGNORE INTO 'students'(id) VALUES(${studentId})`);

		this.students[studentId] = {
			id: studentId,
			exam: '0',
			subjects: ["ex_rus"],
			teachers: [],
			gSolv: 0,
			rightSolv: 0,
			totalSolv: 0,
			mathSolv: 0,
			mathbSolv: 0,
			infSolv: 0,
			rusSolv: 0,
			socSolv: 0,
			enSolv: 0,
			deSolv: 0,
			frSolv: 0,
			spSolv: 0,
			physSolv: 0,
			chemSolv: 0,
			bioSolv: 0,
			geoSolv: 0,
			litSolv: 0,
			histSolv: 0
		};

		return this.students[studentId];
	};

	deleteStudent(studentId) { // Удаление пользователя из таблицы students и из объекта

		if(this.isStudentExists(studentId)) {

			for(var teacher of this.students[studentId].teachers) {

				this.getUserToAll(teacher);

				this.teachers[teacher].students.splice(this.teachers[teacher].students.indexOf(studentId), 1);

			};

		};

		users.exec(`DELETE FROM 'students' WHERE id = ${studentId};`);

		delete this.students[studentId];

		return true;
	};

	getStudent(studentId) { // Занесение пользователя в объект students
		const student = users.prepare(`SELECT * FROM 'students' WHERE id = ${studentId}`).get();

		this.students[studentId] = student;
		this.students[studentId].teachers = JSON.parse(this.students[studentId].teachers);
		this.students[studentId].subjects = JSON.parse(this.students[studentId].subjects);

		return student;
	};

	isStudentExists(studentId) { // Проверка на нахождение пользователя в таблице students
		const student = users.prepare(`SELECT * FROM 'students' WHERE id = ${studentId}`).get();
		
		if(student === undefined) {
			return false;
		} else {
			return true;
		};
	};

	/* Teacher block */

	createTeacher(teacherId) { // Внесение пользователя в таблицу teachers и в объект
		const teacher = users.prepare(`SELECT * FROM 'teachers' WHERE id = ${teacherId}`).get();

		if(teacher !== undefined) {
			this.teachers[teacherId] = teacher;
			this.teachers[teacherId].students = JSON.parse(this.teachers[teacherId].students);
			this.teachers[teacherId].subjects = JSON.parse(this.teachers[teacherId].subjects);

			return teacher;
		};

		users.exec(`INSERT OR IGNORE INTO 'teachers'(id) VALUES(${teacherId})`);

		this.teachers[teacherId] = {
			id: teacherId,
			subjects: [],
			students: []
		};

		return this.teachers[teacherId];
	};

	deleteTeacher(teacherId) { // Удаление пользователя из таблицы teachers и из объекта

		if(this.isTeacherExists(teacherId)) {

			for(var student of this.teachers[teacherId].students) {

				this.getUserToAll(student);

				this.students[student].teachers.splice(this.students[student].teachers.indexOf(teacherId), 1);

			};

		};

		users.exec(`DELETE FROM 'teachers' WHERE id = ${teacherId};`);

		delete this.teachers[teacherId];

		return true;
	};

	getTeacher(teacherId) { // Занесение пользователя в объект teachers
		const teacher = users.prepare(`SELECT * FROM 'teachers' WHERE id = ${teacherId}`).get();

		this.teachers[teacherId] = teacher;
		this.teachers[teacherId].students = JSON.parse(this.teachers[teacherId].students);
		this.teachers[teacherId].subjects = JSON.parse(this.teachers[teacherId].subjects);

		return teacher;
	};

	isTeacherExists(teacherId) { // Проверка на нахождение пользователя в таблице teachers
		const teacher = users.prepare(`SELECT * FROM 'teachers' WHERE id = ${teacherId}`).get();
		
		if(teacher === undefined) {
			return false;
		} else {
			return true;
		};
	};

	/* User block */

	createUser(userId) { // Внесение пользователя в таблицу users и в объект
		const user = users.prepare(`SELECT * FROM 'users' WHERE id = ${userId}`).get();

		if(user != undefined) {
			return null;
		};

		users.exec(`INSERT OR IGNORE INTO 'users'(id) VALUES(${userId})`);

		this.users[userId] = {
			id: userId,
			name: '',
			status: '',
			registration: 'start',
			waitingAnswer: 0
		};

		return this.users[userId];
	};

	getUser(userId) { // Занесение пользователя в объект users
		const user = users.prepare(`SELECT * FROM 'users' WHERE id = ${userId}`).get();

		this.users[userId] = user;

		return user;
	};

	deleteUser(userId) { // Удаление пользователя из таблицы users и из объекта
		users.exec(`DELETE FROM 'users' WHERE id = ${userId};`);

		delete this.users[userId];

		return true;
	};

	isUserExists(userId) { // Проверка на нахождение пользователя в таблице users
		const user = users.prepare(`SELECT * FROM 'users' WHERE id = ${userId}`).get();
		
		if(users === undefined) {
			return false;
		} else {
			return true;
		};
	};
};

module.exports = Database;