const fs = require('fs');
exports.run = (client, message, msg) => {
    let path = './users/' + message.author.id + '.json';
    fs.readFile(path, 'utf8', function (err,raw_user_data) {
        if (err) return console.log(err);
        var user_data = JSON.parse(raw_user_data);
        var _user = client.helpers.get('user');
        var _rank = client.helpers.get('rank');

        message.channel.send(`\`\`\`User: ${message.author.username}\nCash: $${user_data.cash}\nHealth: ${user_data.health}\nRank: ${_rank.getUserRank(user_data)}\nExperience: ${user_data.exp} \`\`\``);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['i'],
    permLevel: 0
};

exports.help = {
    name: "info",
    description: "User info.",
    usage: "info"
};