const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        /ege/g, /oge/g
    ];

    handler = async (ctx) => {

        await this.db.exec(`UPDATE 'students' SET exam = '${ctx.match[0]}' WHERE id = ${ctx.from.id}`);

        return await ctx.editMessageText(
            await format(texts.choise.student.subs, { 'exam': await format(ctx.match[0]) }),
            kb.choise.subsP1
        );

    };

    constructor(bot, db) {
        this.db = db;
        bot.action(this.hears, this.handler);
    };

};