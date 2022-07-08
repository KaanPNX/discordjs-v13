const { Client, Collection } = require("discord.js");
const path = require('path');
const { CommandHandler } = require("../Handler/Command");
const config = require('../config.json');
const { Clients } = require("./Client");
const { SlashCommand } = require("../Handler/SlashCommand");

class Bot {
    /**
     * 
     * @param {Client} client 
     */

    constructor(client){
        client.login(config.token);
        
        client.commands = new Collection();
        client.cooldowns = new Collection();
        client.slashCommands = new Collection();

        new CommandHandler(path.join(__dirname, "..", "Commands"),client);
        new SlashCommand(path.join(__dirname, "..", "SlashCommands"),client)
        new Clients(client);
    }
}

module.exports = {Bot};