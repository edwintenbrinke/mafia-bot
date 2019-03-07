const Discord = require('discord.js');
exports.run = async(client, message, msg) => {
    var _rank = client.helpers.get('rank');
    var _format = client.helpers.get('format')
    var _user = client.helpers.get('user')

    let user_data = await _user.getUserCrimePrison(message.author);

    let embed = new Discord.RichEmbed()
        .setTitle("**Information**")
        .setColor("#FF0000")
        .setThumbnail(message.author.displayAvatarURL)
        .addField("User", message.author.username, true)
        .addField("Health", user_data.health, true)
        .addField("Rank", _rank.getUserRank(user_data).rank, true)
        .addField("Experience", user_data.exp, true)
        .addField("Cash", _format.money(user_data.cash), true)
        .addBlankField()
        .addField("Crimes", user_data.crime.crime_counter, true)
        .addField("Organised crimes", user_data.crime.org_crime_counter, true)
        .addField("Cars stolen", user_data.crime.gta_counter, true)
        .addField("Prison breakouts", user_data.prison.breakout_counter, true);

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
    usage: "information",
    category: "Information"
};