const texts = require('../config/text.json');
const kb = require('../keyboards.js');

module.exports = class {

    handler = async (ctx) => {

        

    };

    constructor(bot, db) {
        this.db = db;
        bot.on('a', this.handler);
    };

};