const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

client.once(Events.ClientReady, () => {
    console.log('🐶Faro🐶 is up!✅');
});

const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(folderPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.error(`🐶Faro🐶: Failed to load command ${command.data.name} from ${filePath}`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`🐶Faro🐶: Failed to find command ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`🐶Faro🐶: Failed to execute command ${interaction.commandName}: ${error}`);
        if (interaction.replied) {
            await interaction.followUp({ content: '🐶Faro🐶: An error occured while executing this command.', ephemeral: true });
        } else {
            await interaction.reply({ content: '🐶Faro🐶: An error occured while executing this command.', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);