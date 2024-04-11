const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping Pong King Kong Hong Kong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
}