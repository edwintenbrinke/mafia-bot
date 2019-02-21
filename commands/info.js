const fs = require('fs');
const User = require('../models/user');
const Discord = require('discord.js');
exports.run = async(client, message, msg) => {
    var _rank = client.helpers.get('rank');

    let user_data = await User.findOne({id: message.author.id});

    let embed = new Discord.RichEmbed()
        .setTitle("**Information**")
        .setColor("#FF0000")
        .setThumbnail(message.author.displayAvatarURL)
        .addField("User", message.author.username, true)
        .addField("Health", user_data.health, true)
        .addField("Rank", _rank.getUserRank(user_data).rank, true)
        .addField("Experience", user_data.exp, true)
        .addField("Cash", `$${user_data.cash}`, true)

    message.channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['i','info'],
    permLevel: 0
};

exports.help = {
    name: "information",
    description: "User information.",
    usage: "information"
};