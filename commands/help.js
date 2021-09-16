const { MessageEmbed } = require("discord.js");
const cmdMsg = require("../util/en.json");
const Mustache = require('mustache');

module.exports = {
    name: "help",
    aliases: ["h"],
    description: cmdMsg.help.description,
    execute(message) {
        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setTitle(Mustache.render(cmdMsg.help.embedTitle, { botname: message.client.user.username }))
            .setDescription(cmdMsg.help.description)
            .setColor("#F8AA2A");

        commands.forEach((cmd) => {
            helpEmbed.addField(
                `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
                `${cmd.description}`,
                true
            );
        });
        helpEmbed.setTimestamp();
        return message.channel.send(helpEmbed).catch(console.error);
    }
};