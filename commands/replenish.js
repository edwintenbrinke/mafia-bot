const User = require('../models/user');
exports.run = async(client, message, msg) => {
    if (msg.length !== 0 && !parseInt(msg, 10)) return console.log("no numeric");

    let user_data = await User.findOne({id: message.author.id});

    var _user = client.helpers.get('user');

    var missing = (100 - user_data.health);

    if(missing === 0) {
        return message.channel.send("You're already full health");
    }

    var cost,amount;
    if (msg.length === 0) {
        cost = missing * 100;
        amount = missing;
    } else {
        amount = parseInt(msg, 10);
        cost = amount * 100;
    }

    if (amount < 0 || amount === Infinity) return;

    if (amount > missing) {
        return message.channel.send("You can't heal higher than 100.");
    }

    if (cost > user_data.cash) {
        return message.channel.send(`You can't afford this. You need $${cost - user_data.cash} more.`);
    }

    user_data.health += amount;
    user_data.cash -= cost;
    message.channel.send(`You have healed for ${amount} health points. This cost you $${cost}.`);
    _user.updateUser(user_data);

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['repl'],
    permLevel: 0
};

exports.help = {
    name: "replenish",
    description: "Replenish your health, $100 = 1 Health",
    usage: "replenish [amount] #no amount = full health"
};