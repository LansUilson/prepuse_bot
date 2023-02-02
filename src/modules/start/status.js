const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        /teacher/g, /student/g
    ];

    handler = async (ctx) => {

        if(ctx.match[0] == "teacher") {
            await this.db.exec(`INSERT OR IGNORE INTO 'teachers'(id) VALUES(${ctx.from.id})`);

            ctx.answerCbQuery();
            return await ctx.editMessageText(
                format(texts.start.teacher.id, { "userID": ctx.from.id }),
                {
                    parse_mode:'markdown',
                    ...kb.start.id
                }
            );
        } else {
            await this.db.exec(`INSERT OR IGNORE INTO 'students'(id) VALUES(${ctx.from.id});
                                UPDATE 'users' SET waitingAnswer = ('teacherID') WHERE id = ${ctx.from.id}`);

            return await ctx.editMessageText(
                texts.start.student.linkTeacher,
                kb.start.linkTeacher
            );
        };

    };

    constructor(bot, db) {
        this.db = db;
        bot.action(this.hears, this.handler);
    };

};