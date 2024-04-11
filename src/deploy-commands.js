const { REST, Routes } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config();

// Create an array to store the command data
const commands = [];

// Load command files and push their data to the commands array
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(folder => {
    const folderPath = path.join(commandsPath, folder);
    fs.readdirSync(folderPath)
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            const command = require(path.join(folderPath, file));
            if (command.data) {
                commands.push(command.data.toJSON());
            } else {
                console.error(`🐶Faro🐶: Failed to load command from ${file}`);
            }
        });
});

// Create a new REST instance and set the bot token
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Immediately-invoked Function Expression (IIFE) to register the commands
(async () => {
    try {
        console.log('🐶Faro🐶: Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('🐶Faro🐶: Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('🐶Faro🐶: Failed to reload application (/) commands:', error);
    }
})();