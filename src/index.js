const loadModules = require('./modulesLoad');
const texts = require('./config/text.json');
const { Telegraf } = require('telegraf');
const { sleep } = require('./methods');
const Database = require('./db/db.js');
const kb = require('./keyboards.js');

const bot = new Telegraf('token');

const db = new Database();

async function initDB() { // Инициальзация БД и обновление её каждые n секунд
	console.log("Initing");
	await sleep(60);
	await db.uploadDatabase();
	initDB();
};
initDB();

bot.use(async (ctx, next) => { // Проверка на существование юзера и занесение его в соответствующие объекты
	await db.createUser(ctx.from.id);
	await db.getUserToAll(ctx.from.id);

	if(ctx.update.callback_query) {

		if(ctx.update.callback_query.data.includes("Cancel")) {

			db.users[ctx.from.id].waitingAnswer = "0";
		
		};

	};

	return await next();
});

loadModules(bot, db);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
