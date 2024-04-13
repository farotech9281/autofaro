const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { MongoClient } = require("mongodb");
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

// Function to store ping data for a given username
async function storeData(username) {
    try {
        // Connect to the MongoDB client
        await client.connect();

        // Specify the database and collection
        const db = client.db('faro');
        const collection = db.collection('pings');

        // Define the filter, update, and options for the updateOne operation
        const filter = { username };
        const update = { $inc: { amount: 1 } };
        const options = { upsert: true };

        // Update the ping data for the given username
        await collection.updateOne(filter, update, options);

        // Log the success message
        console.log(`🐶Faro🐶: Updated pings for ${username}`);
    } catch (error) {
        // Log any errors that occur during the update operation
        console.error(`🐶Faro🐶: An error occurred while storing data: ${error}`);
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
}

// Function to fetch ping data for a given username
async function fetchData(username) {
    try {
        // Connect to the MongoDB client
        await client.connect();

        // Specify the database and collection
        const db = client.db('faro');
        const collection = db.collection('pings');

        // Fetch the ping data for the given username
        const result = await collection.findOne({ username });

        // Return the ping count, or 0 if no data is found
        return result?.amount ?? 0;
    } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error(`🐶Faro🐶: An error occurred while fetching data: ${error}`);

        // Return 0 if an error occurs
        return 0;
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
}

// Export the SlashCommandBuilder object and the execute function
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        // Fetch the username from the interaction object
        const username = interaction.user.username;

        // Store the ping data for the given username
        await storeData(username);

        // Fetch the ping data for the given username
        const amount = await fetchData(username);

        // Create an EmbedBuilder object with the ping count
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`${username} got ponged ${amount} times!`)
            .setColor(0xEC4B27)
            .setFooter({ text: 'Get PONGED!' })
            .setTimestamp();

        // Reply to the interaction with the EmbedBuilder object
        await interaction.reply({ embeds: [embed] });
    }
};