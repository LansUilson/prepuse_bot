const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

    handler = async (ctx) => {
        await this.db.exec(`INSERT OR IGNORE INTO 'users'(id, exam) VALUES(${ctx.from.id}, '0')`);

        return await ctx.telegram.sendMessage(
            ctx.from.id,
            texts.start,
            kb.startKb
        );
    };

    constructor(bot, db) {
        this.db = db;
        bot.start(this.handler);
    };

};