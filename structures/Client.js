const {Client} = require('discord.js')
const config = require('../config.json');

class Clients {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client){
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        client.on('messageCreate', async(message) => {
            if (message.author.bot || !message.guild) return;

            const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`);
            
            if (!prefixRegex.test(message.content)) return;
            const [, matchedPrefix] = message.content.match(prefixRegex);

            const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.commands.get(commandName) ?? client.commands.find((cmd) => cmd.aliases?.includes(commandName));
            if (!command) return;

            if (!client.cooldowns.has(command.name)) {
              client.cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps  = client.cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 1) * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
                if (now < expirationTime) {
                  const timeLeft = (expirationTime - now) / 1000;
                  return;
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            try {
                command.execute(message, args);
              } catch (error) {
                console.error(error);
              }
        });

        client.on('interactionCreate',async(interaction) => {
            if (!interaction.isCommand()) return;

            const command = client.slashCommands.get(interaction.commandName);

            try {
                await command.execute(interaction, client);
              } catch (error) {
                console.error(error);
                await interaction.reply({
                  content: "Komut çalıştırılırken bir hata oluştu!",
                  ephemeral: true,
                });
              }
        })
    }
}

module.exports = {Clients};