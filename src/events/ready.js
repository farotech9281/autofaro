const { Events } = require('discord.js');

// Export an object to handle the ClientReady event
module.exports = {
    // Set the event name to ClientReady
    name: Events.ClientReady,

    // Only execute this once when the bot starts up
    once: true,

    // The event handler function
    execute() {

        // Log a message to indicate the bot is ready
        console.log('🐶Faro🐶 is up!✅');
    }
}
