const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

    handler = async (ctx) => {

        await this.db.exec(`INSERT OR IGNORE INTO 'users'(id) VALUES(${ctx.from.id})`);

        return await ctx.telegram.sendMessage(
            ctx.from.id,
            texts.start.start,
            kb.start.start
        );

    };

    constructor(bot, db) {
        this.db = db;
        bot.start(this.handler);
    };

};