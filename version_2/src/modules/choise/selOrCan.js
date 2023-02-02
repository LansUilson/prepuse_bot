const { format } = require('../../methods.js');
const { Markup } = require('telegraf');

module.exports = class {

    hears = [
        /ex_math$/g, /ex_mathb$/g, /ex_inf/g, /ex_phys/g, /ex_soc/g, /ex_chem/g, /ex_bio/g, /ex_geo/g, /ex_hist/g, /ex_lit/g, /ex_en/g, /ex_de/g, /ex_fr/g, /ex_sp/g,
    ];

    handler = async (ctx) => {

        const message = ctx.update.callback_query.message;
        const inline = message.reply_markup.inline_keyboard;

        let subjects = await JSON.parse(await this.db.prepare(`SELECT subjects FROM 'users' WHERE id = ${ctx.from.id}`).get().subjects);
        await console.log(subjects);
        if(await ctx.match[0].includes("math")) {

            if(ctx.match[0] == "ex_math") {
                inline[0][0].text = "Математика (База) ✅";
                inline[0][0].callback_data = "ex_mathb";

                await subjects.splice(subjects.indexOf("ex_math"), 1);
                await subjects.push("ex_mathb");
            } else {
                inline[0][0].text = "Математика (Профиль) ✅";
                inline[0][0].callback_data = "ex_math";

                await subjects.splice(subjects.indexOf("ex_mathb"), 1);
                await subjects.push("ex_math");
            };

        } else {

            for(var block of inline.slice(1,-3)) {
                for(var key of block) {
                    if(key.callback_data == ctx.match[0]) {
                        if(await key.text.substring(key.text.length - 2) == " ✅") {
                            key.text = await key.text.slice(0,-2);

                            await subjects.splice(subjects.indexOf(key.callback_data), 1);
                        } else {
                            key.text += " ✅";

                            await subjects.push(key.callback_data);
                        };
                    };
                };
            };

        };

        subjects = [...await new Set(subjects)];

        await this.db.exec(`UPDATE 'users' SET subjects = '${JSON.stringify(subjects)}' WHERE id = ${ctx.from.id}`);

        try {
            return await ctx.editMessageText(
                ctx.update.callback_query.message.text, { 
                    reply_markup: await JSON.stringify({ 
                        inline_keyboard: message.reply_markup.inline_keyboard
                    }) 
                }
            );
        } catch {};

    };

    constructor(bot, db) {
        this.db = db;
        bot.action(this.hears, this.handler);
    };

};