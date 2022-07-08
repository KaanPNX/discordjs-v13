const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor(path,client){
        fs.readdirSync(path).forEach((dir) => {
            const commands = fs.readdirSync(path + `/${dir}/`).filter(file => file.endsWith('.js'));

            for(let file of commands){
                let pull = require(path + `/${dir}/${file}`);
                if(pull.name != undefined){
                    client.commands.set(pull.name, pull);
                };
            }
        });
    }
}

module.exports = {CommandHandler};