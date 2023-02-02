const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        'nextPSub',
        'prevPSub'
    ];

    handlerNext = async (ctx) => {
        return await ctx.editMessageText(
            ctx.update.callback_query.message.text,
            kb.choiceSubP2Kb
        );
    };

    handlerPrev = async (ctx) => {
        return await ctx.editMessageText(
            ctx.update.callback_query.message.text,
            kb.choiceSubP1Kb
        );
    };

    constructor(bot) {
        bot.action(this.hears[0], this.handlerNext);
        bot.action(this.hears[1], this.handlerPrev);
    };

};