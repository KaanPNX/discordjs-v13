const { Client, Intents } = require('discord.js');
const { Bot } = require('./structures/Bot');

new Bot(new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
],
presence:{
    status: "dnd"
}
}));