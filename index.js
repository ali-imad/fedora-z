// start up env process
require('dotenv').config();

// require the necessary discord.js classes
const { readdirSync } = require('fs');
const { join } = require('path');
const { Client, Collection, Intents } = require('discord.js');
const Mustache = require('mustache');
const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX;
const cmdMsg = require("./util/en.json");

// create a new client instance
const client = new Client({
    disableMentions: "everyone",
    restTimeOffset: 0
});


// login to discord with your client token
client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// import the commands from the dir based on their name
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
client.once('ready', () => {
    console.log(`Bot ${client.user.username} ready!`);
    client.user.setActivity(`${PREFIX}help and ${PREFIX}play`, { type: "LISTENING" });
});

client.on("warn", (info) => console.log(info));
client.on("error", console.error);

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = 
        client.commands.get(commandName) || 
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;
    
    if (!cooldowns.has(commandName)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
            Mustache.render(cmdMsg.common.cooldownMessage, 
                { time: timeLeft.toFixed(1), name: command.name })
        )}
    }


    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(cmdMsg.common.errorCommand).catch(console.error);
    }
});
