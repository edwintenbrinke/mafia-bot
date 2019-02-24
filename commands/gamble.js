const User = require('../models/user');
exports.run = async(client, message, msg) => {
    if (!parseInt(msg, 10)) return;

    var _format = client.helpers.get('format');

    let user_data = await User.findOne({id: message.author.id});

    var amount = parseInt(msg, 10);

    if (amount < 0 || amount === Infinity) return;

    if (user_data.cash < amount) {
        message.channel.send('You don\'t have enough cash, you have '+_format.money(user_data.cash.toString()));
        return;
    }

    var return_message;
    var awnser = Math.random()*100;
    switch(true) {
        case (awnser > 99):
            amount *= 10;
            return_message = "Jackpot!";
            break;
        case (awnser >= 50):
            return_message = "You won!";
            break;
        case (awnser < 50):
            amount = amount * -1;
            return_message = "You lost.";
            break;
        default:
            console.log('wtf')
    }

    user_data.cash += amount;

    message.channel.send(return_message + " Your cash is "+_format.money(user_data.cash.toString())+". You rolled a " + Math.round(awnser));
    var _user = client.helpers.get('user');
    _user.updateUser(user_data);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "g50",
    description: "50/50 to win, you have to roll higher than 50.",
    usage: "g50 [cash]"
};