const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Client } = require("discord.js");
const fs = require('fs');
const config = require('../config.json')

class SlashCommand {
/**
 * @param {Client} client 
 */
    constructor(path,client){
        client.interactionsArray = [];
 
        fs.readdirSync(path).forEach((dir) => {
            const commands = fs.readdirSync(path + `/${dir}/`).filter(file => file.endsWith('.js'));
            
            for(let file of commands){
                let pull = require(path + `/${dir}/${file}`);
                if(pull.command.name != undefined){
                    client.slashCommands.set(pull.command.name, pull);
                    client.interactionsArray.push(pull.command.toJSON());

                };
            }
        })

        const rest = new REST({ version: "10" }).setToken(config.token);

        (async () => {
            try {
              const guildIds = await client.guilds.cache.map((guild) => guild.id);
              guildIds.forEach(async (guildId) => {
                await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {
                  body: client.interactionsArray,
                });
              });
              console.log('Successfully Refreshed Slash Command List!');
            } catch (error) {
              console.error(error);
            }
          })();
    }
}

module.exports = {SlashCommand};