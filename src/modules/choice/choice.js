const texts = require('../../config/text.json');
const { choiceKb } = require('../../keyboards.js');

module.exports = class {

    hears = [
        'start'
    ];

    handler = async (ctx) => {
        return ctx.editMessageText(
            texts.choice,
            choiceKb
        );
    };

    constructor(bot) {
        bot.action(this.hears, this.handler);
    };

};