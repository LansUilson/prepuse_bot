const texts = require('../../config/text.json');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        /ex_(.+)?/g
    ];

    handler = async (ctx) => {
        var subect = ctx.match[1];
        return await ctx.editMessageText(
            texts.choiceSub,
            kb.choiceKb
        );
    };

    constructor(bot) {
        bot.action(this.hears, this.handler);
    };

};