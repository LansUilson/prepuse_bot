const texts = require('../../config/text.json');
const { choiceSubP2Kb, choiceSubP1Kb } = require('../../keyboards.js');

module.exports = class {

    hears = [
        'nextPSub',
        'prevPSub'
    ];

    handlerNext = async (ctx) => {
        return ctx.editMessageText(
            ctx.update.callback_query.message.text,
            choiceSubP2Kb
        );
    };

    handlerPrev = async (ctx) => {
        return ctx.editMessageText(
            ctx.update.callback_query.message.text,
            choiceSubP1Kb
        );
    };

    constructor(bot) {
        bot.action(this.hears[0], this.handlerNext);
        bot.action(this.hears[1], this.handlerPrev);
    };

};