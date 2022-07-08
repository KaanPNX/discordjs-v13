const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    command: new SlashCommandBuilder()
      .setName("test")
      .setDescription("test"),
    async execute(interaction) {
      await interaction.reply("Test");
    },
};