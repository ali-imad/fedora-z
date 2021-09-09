// require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

// when the clietn is ready, run this code
client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    if (commandName === 'server') {
        await interaction.reply('Server info.');
    }
    if (commandName === 'user') {
        await interaction.reply('User info.');
    }
});

// login to discord with your client token
client.login(token)
