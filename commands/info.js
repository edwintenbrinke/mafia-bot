const fs = require('fs');
exports.run = (client, message, msg) => {
    let path = './users/' + message.author.id + '.json';
    fs.readFile(path, 'utf8', function (err,raw_user_data) {
        if (err) return console.log(err);
        var user_data = JSON.parse(raw_user_data);

        message.channel.send('User: ' + message.author.username + '\nCash: $' + user_data.cash);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "i",
    description: "User info.",
    usage: "i"
};