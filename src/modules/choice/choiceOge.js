const texts = require('../../config/text.json');
const { choiceSubP1Kb } = require('../../keyboards.js');

module.exports = class {

    hears = [
        'oge'
    ];

    handler = async (ctx) => {
        this.db.exec(`UPDATE 'users' SET exam = 'oge' WHERE id = ${ctx.from.id}`);

        return ctx.editMessageText(
            texts.choiceOge,
            choiceSubP1Kb
        );
    };

    constructor(bot, db) {
        this.db = db;
        bot.action(this.hears, this.handler);
    };

};