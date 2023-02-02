const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        /start/g
    ]

    handler = async (ctx) => {

        if(ctx.hasOwnProperty('match')) {
            await this.db.exec(`DELETE FROM 'teachers' WHERE id = ${ctx.from.id};
                                DELETE FROM 'students' WHERE id = ${ctx.from.id}`);

            return await ctx.editMessageText(
                texts.start.start,
                kb.start.start
            );
        };

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
        bot.action(this.hears, this.handler);
    };

};