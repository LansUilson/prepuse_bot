const texts = require('../../config/text.json');
const { format } = require('../../methods.js');
const kb = require('../../keyboards.js');

module.exports = class {

    hears = [
        /prevPSubs/g, /nextPSubs/g
    ];

    handler = async (ctx) => {

        const message = ctx.update.callback_query.message;
        const inline = message.reply_markup.inline_keyboard;

        let subjects = JSON.parse(await this.db.prepare(`SELECT subjects FROM 'users' WHERE id = ${ctx.from.id}`).get().subjects);

        if(ctx.match[0] == "nextPSubs") {
            var keyboard = JSON.parse(JSON.stringify(kb.choise.subsP2));
        } else {
            var keyboard = JSON.parse(JSON.stringify(kb.choise.subsP1));
        };

        for(var block of keyboard.reply_markup.inline_keyboard.slice(0,-3)) {
            for(var key of block) {
                if(subjects.includes(key.callback_data)) {
                    if(key.text.substring(key.text.length - 2) != " ✅") {
                        key.text += " ✅";
                    };
                };
            };
        };

        try {
            return await ctx.editMessageText(
                ctx.update.callback_query.message.text, { 
                    reply_markup: JSON.stringify({ 
                        inline_keyboard: keyboard.reply_markup.inline_keyboard
                    }) 
                }
            );
        } catch(e) {};
/*
        const message = ctx.update.callback_query.message;
        const inline = message.reply_markup.inline_keyboard;

        let subjects = JSON.parse(await this.db.prepare(`SELECT subjects FROM 'users' WHERE id = ${ctx.from.id}`).get().subjects);

        console.log(subjects);
        for(var block of inline.slice(0,-3)) {
            for(var key of block) {
                if(key.text.substring(key.text.length - 2) == " ✅") {
                    if(!subjects.includes(key.callback_data)){
                        subjects.push(key.callback_data);
                    };
                };
            };
        };
        console.log(subjects);
        await this.db.exec(`UPDATE 'users' SET subjects = '${JSON.stringify(subjects)}' WHERE id = ${ctx.from.id}`);

        if(ctx.match[0] == "nextPSubs") {
            var keyboard = kb.choise.subsP2;
        } else {
            var keyboard = kb.choise.subsP1;
        };

        console.log(keyboard.reply_markup.inline_keyboard);

        for(var block of keyboard.reply_markup.inline_keyboard.slice(0,-3)) {
            for(var key of block) {
                if(subjects.includes(key.callback_data)) {
                    if(key.text.substring(key.text.length - 2) != " ✅") {
                        key.text += " ✅";
                    };
                };
            };
        };

        return await ctx.editMessageText(
            ctx.update.callback_query.message.text, { 
                reply_markup: JSON.stringify({ 
                    inline_keyboard: keyboard.reply_markup.inline_keyboard
                }) 
            }
        );
*/
    };
    constructor(bot, db) {
        this.db = db;
        bot.action(this.hears, this.handler);
    };

};