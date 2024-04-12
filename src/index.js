const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { join } = require('node:path');
const { readdirSync } = require('node:fs');
require('dotenv').config();

// Create a new client instance with the required intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create a collection for commands
client.commands = new Collection();

// Load commands from the 'commands' folder
const commandsPath = join(__dirname, 'commands');
readdirSync(commandsPath).forEach(folder => {
    const commandFiles = readdirSync(join(commandsPath, folder))
        .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(join(commandsPath, folder, file));
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        } else {
            console.error(`🐶Faro🐶: Failed to load command from ${file}`);
        }
    }
});

// Load events from the 'events' folder
const eventsPath = join(__dirname, 'events');
readdirSync(eventsPath).forEach(file => {
    if (file.endsWith('.js')) {
        const event = require(join(eventsPath, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
});

// Log in to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);