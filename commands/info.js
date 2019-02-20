const fs = require('fs');
const Discord = require('discord.js');
exports.run = (client, message, msg) => {
    let path = './users/' + message.author.id + '.json';
    fs.readFile(path, 'utf8', function (err,raw_user_data) {
        if (err) return client.log(err);
        var user_data = JSON.parse(raw_user_data);
        var _user = client.helpers.get('user');
        var _rank = client.helpers.get('rank');

       // message.channel.send(`User: ${message.author.username}\nCash: $${user_data.cash}\nHealth: ${user_data.health}\nRank: ${_rank.getUserRank(user_data).rank}\nExperience: ${user_data.exp}`, {code: 'asciidoc'});

        let embed = new Discord.RichEmbed()
            .setTitle("**Information**")
            .setColor("#FFC500")
            .setThumbnail(message.author.displayAvatarURL)
            .addField("User", message.author.username, true)
            .addField("Health", user_data.health, true)
            .addField("Rank", _rank.getUserRank(user_data).rank, true)
            .addField("Experience", user_data.exp, true)
            .addField("Cash", `$${user_data.cash}`, true)

        message.channel.send(embed);

    });
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