const texts = require('../../config/text.json');
const { startKb } = require('../../keyboards.js');

module.exports = class {

    handler = async (ctx) => {
        this.db.exec(`INSERT OR IGNORE INTO 'users'(id, exam) VALUES(${ctx.from.id}, '0')`);

        return ctx.telegram.sendMessage(
            ctx.from.id,
            texts.start,
            startKb
        );
    };

    constructor(bot, db) {
        this.db = db;
        bot.start(this.handler);
    };

};