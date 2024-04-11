const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// Create a new client instance with the required intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create a collection for commands
client.commands = new Collection();

// Load commands from the 'commands' folder
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(folder => {
    const commandFiles = fs.readdirSync(path.join(commandsPath, folder))
        .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, folder, file));
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        } else {
            console.error(`🐶Faro🐶: Failed to load command from ${file}`);
        }
    }
});

// Event listener for when the client is ready
client.once(Events.ClientReady, () => {
    console.log('🐶Faro🐶 is up!✅');
});

// Event listener for command interactions
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`🐶Faro🐶: Command not found: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`🐶Faro🐶: Command execution error: ${interaction.commandName}: ${error}`);
        await interaction.reply({ content: '🐶Faro🐶: An error occurred while executing the command.', ephemeral: true });
    }
});

// Log in to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);