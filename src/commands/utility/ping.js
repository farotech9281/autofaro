const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { MongoClient } = require("mongodb");
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

async function storeData(username) {
    try {
        await client.connect();
        const db = client.db('faro');
        const collection = db.collection('pings');
        const filter = { username };
        const update = { $inc: { amount: 1 } };
        const options = { upsert: true };
        await collection.updateOne(filter, update, options);
        console.log(`🐶Faro🐶: Updated pings for ${username}`);
    } catch (error) {
        console.error(`🐶Faro🐶: An error occurred while storing data: ${error}`);
    } finally {
        await client.close();
    }
}

async function fetchData(username) {
    try {
        await client.connect();
        const db = client.db('faro');
        const collection = db.collection('pings');
        const result = await collection.findOne({ username });
        return result?.amount ?? 0;
    } catch (error) {
        console.error(`🐶Faro🐶: An error occurred while fetching data: ${error}`);
        return 0;
    } finally {
        await client.close();
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const username = interaction.user.username;
        await storeData(username);
        const amount = await fetchData(username);
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`${username} got ponged ${amount} times!`)
            .setColor(0xEC4B27)
            .setFooter({ text: 'Get PONGED!' })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};