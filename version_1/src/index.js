const ex = require('better-sqlite3')('./src/db/exercices.db');
const db = require('better-sqlite3')('./src/db/users.db');
const { message } = require('telegraf/filters');
const loadModules = require('./modulesLoad');
const { Telegraf } = require('telegraf');

const bot = new Telegraf('5776577856:AAHvmZskCnlNi89Fq3FDQWYT5pTwfwOHtZE');

loadModules(bot, db);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));