const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        'start'
    ];

    handler = async (ctx) => {
        return await ctx.editMessageText(
            texts.choiceExam,
            kb.choiceKb
        );
    };

    constructor(bot) {
        bot.action(this.hears, this.handler);
    };

};