exports.run = (client, message, msg) => {
    var file = client.helpers.get('user');
    file.updateUserPoints(message.author, 50);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "p",
    description: "",
    usage: ""
};