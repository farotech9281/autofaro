const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Adds a reaction role to the given message')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Add a reaction role')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('The ID of the message to add a reaction to')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('emoji')
                        .setDescription('The emoji to react with')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to give')
                        .setRequired(true))),

    async execute(interaction) {
        const messageId = interaction.options.getString('message_id').split('/').slice(-3)[2];
        const emoji = interaction.options.getString('emoji');
        const role = interaction.options.getRole('role');

        try {
            // Fetch the message using the provided ID
            const message = await interaction.channel.messages.fetch(messageId);

            // Add the reaction to the message
            await message.react(emoji);

            // Create an embed to confirm the reaction role has been added
            const embed = new EmbedBuilder()
                .setTitle('Reaction Role Added')
                .setDescription(`Reacting with ${emoji} will now give the ${role.name} role.`)
                .setColor('#0099ff');

            // Reply to the interaction with the confirmation embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};

