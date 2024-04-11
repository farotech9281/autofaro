const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        // Check if the interaction is a command
        if (!interaction.isCommand()) return;

        // Get the command from the client's commands collection
        const command = interaction.client.commands.get(interaction.commandName);

        // If command not found, log error and return
        if (!command) {
            console.error(`🐶Faro🐶: Command not found: ${interaction.commandName}`);
            return;
        }

        // Try executing the command
        try {
            await command.execute(interaction);

            // Catch and log any errors    
        } catch (error) {
            console.error(`🐶Faro🐶: Command execution error: ${interaction.commandName}: ${error}`);
            await interaction.reply({ content: '🐶Faro🐶: An error occurred while executing the command.', ephemeral: true });
        }
    }
}
