const { subs, hashCode } = require('../../../../methods.js');
const texts = require('../../../../config/text.json');
const kb = require('../../../../keyboards.js');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const ege_rus = require('better-sqlite3')('./src/db/ege/ege_rus.db');
const exercices = require('better-sqlite3')('./src/db/exercices.db');
const variants = require('better-sqlite3')('./src/db/variants.db');
const tasks =require('better-sqlite3')('./src/db/tasks.db');

module.exports = class {

	hears = [
		/solvF_(.+)/g
	];

	handler = async (ctx) => {

		if(ctx.match[1] == "rus") {

			await ctx.editMessageText(
				texts.solve.wait
			);

			var variant = [];

			const catList = await exercices.prepare("SELECT * FROM ege_rus").all();
			const tsks = await tasks.prepare("SELECT * FROM tasks WHERE exam = 'ege' AND subject = 'rus'").all();
			const texts13 = await tasks.prepare("SELECT * FROM attachable WHERE tasks = '1-3' AND subject = 'rus'").all();
			const texts22 = await tasks.prepare("SELECT * FROM attachable WHERE tasks = '22-27' AND subject = 'rus'").all();

			const randText13 = texts13[await Math.floor(await Math.random() * texts13.length)]
			const randText22 = texts22[await Math.floor(await Math.random() * texts22.length)]

			const ex1 = await tasks.prepare(`SELECT * FROM tasks WHERE attach = ${randText13.id} AND number = 1 AND subject = 'rus'`).all();
			const ex2 = await tasks.prepare(`SELECT * FROM tasks WHERE attach = ${randText13.id} AND number = 2 AND subject = 'rus'`).all();
			const ex3 = await tasks.prepare(`SELECT * FROM tasks WHERE attach = ${randText13.id} AND number = 3 AND subject = 'rus'`).all();
			variant.push(ex1[0]);
			variant.push(ex2[0]);
			variant.push(ex3[0]);


			for(let i = 4; i < 22; i++) {
		
				const ex = await tasks.prepare(`SELECT * FROM tasks WHERE number = ${i} AND subject = 'rus'`).all();
				variant.push(ex[Math.floor(Math.random() * ex.length)])

			};

			const ex22 = await tasks.prepare(`SELECT * FROM tasks WHERE attach = ${randText22.id} and number = 22 AND subject = 'rus'`).all();
			const ex23 = await tasks.prepare(`SELECT * FROM tasks WHERE attach = ${randText22.id} and number = 23 AND subject = 'rus'`).all();
			const ex24 = await tasks.prepare(`SELECT * FROM tasks WHERE attach = ${randText22.id} and number = 24 AND subject = 'rus'`).all();
			const ex25 = await tasks.prepare(`SELECT * FROM tasks WHERE attach = ${randText22.id} and number = 25 AND subject = 'rus'`).all();
			const ex26 = await tasks.prepare(`SELECT * FROM tasks WHERE attach = ${randText22.id} and number = 26 AND subject = 'rus'`).all();
			const ex27 = await tasks.prepare(`SELECT * FROM tasks WHERE attach = ${randText22.id} and number = 27 AND subject = 'rus'`).all();
			variant.push(ex22[0]);
			variant.push(ex23[0]);
			variant.push(ex24[0]);
			variant.push(ex25[0]);
			variant.push(ex26[0]);
			variant.push(ex27[0]);

			const date = await Math.floor(Date.now() / 1000);
			const variantID = await hashCode(date.toString());
			
			await variants.exec(`INSERT INTO 'variants' (variantOwner, variantID, subject, startDate) VALUES (${ctx.from.id}, '${variantID}', '${ctx.match[1]}', ${date})`);

			await variants.exec(`CREATE TABLE 'variant_${variantID}' (
								number	INTEGER NOT NULL,
								text	TEXT NOT NULL,
								solve	TEXT,
								answer	TEXT,
								userAnswer TEXT,
								points  INTEGER DEFAULT 0,
								maxPoints INTEGER
							);
			`)

			var request = "";

			for(var task of variant) {

				if([1,2,3].includes(task.number)) {

					task.content = task.content + "\n\n" + randText13.content;

				} else if([22,23,24,25,26,27].includes(task.number)) {

					task.content = task.content + "\n\n" + randText22.content;

				};

				var maxPoints = 0;

				switch(task.number) {

					case 8:
						maxPoints = 3;
						break;
					case 26:
						maxPoints = 3;
						break;
					case 27:
						maxPoints = 24;
						break;
					default:
						maxPoints = 1;
						break;

				};
				
				request += `INSERT INTO 'variant_${variantID}' (number, text, solve, answer, maxPoints) VALUES (${task.number}, '${task.content}', '${task.solve}', '${task.answer}', ${maxPoints});`;

			};

			await variants.exec(request);

			var keyboard = JSON.parse(JSON.stringify(kb.solve.choiceSubject))

			for(let x = 1; x < 28; x++) {

				if(x % 2 != 0) {

					keyboard.reply_markup.inline_keyboard.push([ { text: `Задание ${x}`, callback_data: `number_${x}_${variantID}` } ]);

				} else {

					keyboard.reply_markup.inline_keyboard[keyboard.reply_markup.inline_keyboard.length-1].push({ text: `Задание ${x}`, callback_data: `number_${x}_${variantID}` });

				};				

			};

			keyboard.reply_markup.inline_keyboard.push([ { text: "Сдать работу", callback_data: `acceptDone_${variantID}` } ]);
			keyboard.reply_markup.inline_keyboard.push([ { text: "Назад", callback_data: "menuCancel" } ]);

			return await ctx.editMessageText(
				texts.solve.rusDone,
				keyboard
			);

		};

	};

	constructor(bot, db) {
		this.db = db;
		bot.action(this.hears, this.handler);
	};

};