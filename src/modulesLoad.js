const fs = require('fs');

function getDirFiles(path='', jss=[]) {
    path = path ? path : `${__dirname}/modules`;
    const files = fs.readdirSync(path);

    files.forEach(file => {
        if ( fs.lstatSync(`${path}/${file}`).isDirectory() ) {
            getDirFiles(`${path}/${file}`, jss);
        } else if ( file.endsWith(".js") ) {
            jss.push(`${path}/${file}`);
        };
    });

    return jss
};

module.exports = function (tg, db) {
    getDirFiles().forEach(file => {
        const command = require(file);
        const path = file
            .replace(`${__dirname}`, "")
            .replace(/\\/g, "/");

        console.log(`[${COLORS.PINK}LOAD MODULE${COLORS.NONE}]: `
            + `${COLORS.GREEN}@${path.substr(1, path.length - 4)}${COLORS.NONE}`);

        new command(tg, db);
    });
};

const COLORS =  {
    NONE: "\x1b[0m",
    PINK: "\x1b[35m",
    GREEN: "\x1b[32m",
};