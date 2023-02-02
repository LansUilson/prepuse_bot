const ex = require('better-sqlite3')('./db/exercices.db');
const db = require('better-sqlite3')('./db/users.db');
const { message } = require('telegraf/filters');
const loadModules = require('./modulesLoad');
const { Telegraf } = require('telegraf');

const bot = new Telegraf('5776577856:AAHvmZskCnlNi89Fq3FDQWYT5pTwfwOHtZE');

bot.hears(/popo/g, async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.state.role}`);
});

loadModules(bot, db);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));