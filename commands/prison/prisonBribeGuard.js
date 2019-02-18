exports.run = (client, message, msg) => {
    message.channel.send("This is not implemented yet.")
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['pbg'],
    permLevel: 0
};

exports.help = {
    name: "prisonBribeGuard",
    description: "Try to bribe a guard. You'll try to offer $100 for every 10 seconds in jail",
    usage: "prisonBribeGuard"
};