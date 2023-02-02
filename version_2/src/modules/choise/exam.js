const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        /start/g
    ];

    handler = async (ctx) => {

        return await ctx.editMessageText(
            texts.choise.exam,
            kb.choise.exam
        );

    };

    constructor(bot) {
        bot.action(this.hears, this.handler);
    };

};