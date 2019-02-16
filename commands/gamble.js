const fs = require('fs');
exports.run = (client, message, msg) => {
    if (!parseInt(msg, 10)) return console.log("no numeric");

    let path = './users/' + message.author.id + '.json';
    fs.readFile(path, 'utf8', function (err,raw_user_data) {
        if (err) return console.log(err);
        var user_data = JSON.parse(raw_user_data);

        var amount = parseInt(msg, 10);

        if (amount < 0 || amount === Infinity) return;

        if (user_data.cash < amount) {
            message.channel.send('You don\'t have enough cash, you have $'+user_data.cash.toString());
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

        message.channel.send(return_message + " Your cash is $"+user_data.cash.toString()+". You rolled a " + Math.round(awnser));
        var file = client.helpers.get('user');
        file.writeFile(path, JSON.stringify(user_data));
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "g50",
    description: "50/50 to win",
    usage: "g50 [number]"
};