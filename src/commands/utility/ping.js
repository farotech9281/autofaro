const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription('Here is your PONG!')
            .setColor(0xEC4B27)
            .setFooter({ text: 'Get PONGED!' })
            .setTimestamp()

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm')
            .setStyle('Primary');
        const deny = new ButtonBuilder()
            .setCustomId('deny')
            .setLabel('Deny')
            .setStyle('Danger');
        const row = new ActionRowBuilder()
            .addComponents(confirm, deny);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
}