const fs = require('fs');
exports.run = (client, message, msg) => {
    let path = './users/' + message.author.id + '.json';
    fs.readFile(path, 'utf8', function (err,raw_user_data) {
        if (err) return console.log(err);
        var user_data = JSON.parse(raw_user_data);
        var file = client.helpers.get('user');
        var date = client.helpers.get('date');

        if (date.isInTheFuture(user_data.crime)) {
            message.channel.send(date.timeLeft(user_data.crime));
            return;
        }

        var return_message, amount;
        var awnser = Math.random() * 100;
        switch (true) {
            case (awnser > 97.5):
                amount = (client.randomBetween(100, 250) * 10);
                return_message = "Jackpot! Your cash is $"+(user_data.cash + amount).toString()+". You recieved $" + Math.round(amount);
                break;
            case (awnser >= 25):
                amount = client.randomBetween(100, 250);
                return_message = "Success! Your cash is $"+(user_data.cash + amount).toString()+". You recieved $" + Math.round(amount);
                break;
            case (awnser < 25):
                var new_health = client.randomBetween(1,10);
                user_data.health -= new_health;
                return_message = `Failure. You've lost ${new_health.toString()} health.`;
                break;
            default:
                console.log('wtf')
        }

        if (amount > 0) {
            user_data.cash += amount;
            user_data.exp += 10;
        }

        user_data.crime = date.addSeconds(60);

        message.channel.send(return_message);
        file.writeFile(path, JSON.stringify(user_data));

    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['c'],
    permLevel: 0
};

exports.help = {
    name: "crime",
    description: "do a crime",
    usage: "crime"
};