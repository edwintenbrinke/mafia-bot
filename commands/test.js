const User = require('../models/user');
const mongoose = require('mongoose');
const Discord = require('discord.js');

exports.run = (client, message, msg) => {

    var _user = client.helpers.get('user');
    _user.initUser(message.author, true);
    return;
    mongoose.connect('mongodb://localhost/user', {useNewUrlParser: true});

    const user = new User({
        _id: mongoose.Types.ObjectId(),
        username: message.author.username,
        id: message.author.id,
        health: 100
    });

    let result = new Promise((resolve, reject) => {
        user.save()
            .then(resolve('pizza'))
            .catch(reject)
    });

    console.log(result);

    let embed = new Discord.RichEmbed()
        .setTitle("Fancy")
        .setColor("#00ff59")
        .setThumbnail(message.author.displayAvatarURL)
        .addField("User", user.username);

    message.channel.send(embed);

};



exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['t'],
    permLevel: 0
};

exports.help = {
    name: "test",
    description: "test",
    usage: "test"
};
