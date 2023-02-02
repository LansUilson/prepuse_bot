const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        /menu(.+)?/g, /menu/g
    ];

    handler = async (ctx) => {
        if(ctx.match[1] == 'Ege') {
            var text = format(texts.menu, { 'exam': "ЕГЭ" });
            await this.db.exec(`UPDATE 'users' SET exam = 'ege' WHERE id = ${ctx.from.id}`);
        } else if(ctx.match[1] == 'Oge') {
            var text = format(texts.menu, { 'exam': "ОГЭ" });
            await this.db.exec(`UPDATE 'users' SET exam = 'oge' WHERE id = ${ctx.from.id}`);
        } else if(ctx.match[1] == undefined) {
            var exam = await this.db.prepare(`SELECT exam FROM 'users' WHERE id = ${ctx.from.id}`).get();
            console.log(exam.exam == 'oge');
            if(exam.exam == 'ege') {
                console.log(exam.exam);
                var text = format(texts.menu, { 'exam': "ЕГЭ" })
            } else if(exam.exam == 'oge') {
                console.log(exam.exam);
                var text = format(texts.menu, { 'exam': "ОГЭ" })
            };
        };

        return await ctx.editMessageText(
            text,
            kb.menuKb
        );
    };

    constructor(bot, db) {
        this.db = db;
        bot.action(this.hears, this.handler);
    };

};