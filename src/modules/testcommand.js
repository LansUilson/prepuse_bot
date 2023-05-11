const ege_rus = require('better-sqlite3')('/home/lans/project/version_4/src/db/ege/ege_rus.db');

module.exports = class {

	hears = [
		/text (.+)/g
	];

	handler = async (ctx) => {

		const text = ege_rus.prepare(`SELECT * FROM texts WHERE id = ${ctx.match[1]}`).get();

		console.log(text.text.replace(/(<p[^>]*>|<\/p>)/g, "\n").replace(/(<center[^>]*>|<\/center>)/g, ""));
		return await ctx.telegram.sendMessage(
			ctx.from.id,
			text.text.replace(/&nbsp;/g, "\n"),
			{ parse_mode: "HTML" }
		);


	};

	constructor(bot, db) {
		bot.hears(/\/getText (.+)/g, this.handler);
	};

};