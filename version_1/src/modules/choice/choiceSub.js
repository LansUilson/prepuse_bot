const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        /choiceSub/g
    ];

    handler = async (ctx) => {
        return await ctx.editMessageText(
            texts.choiceSub,
            kb.choiceSubP1Kb
        );
    };

    constructor(bot) {
        bot.action(this.hears, this.handler);
    };

};