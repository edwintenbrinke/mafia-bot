
const User = require('../../models/user');
const Crime = require('../../models/crime');
const Prison = require('../../models/prison');
exports.run = async(client, message, msg) => {
    let user_data = await User.findOne({id: message.author.id});
    let crime = await Crime.findOne({id: message.author.id});
    let prison = await Prison.findOne({id: message.author.id});

    var _user = client.helpers.get('user');
    var _date = client.helpers.get('date');
    var _prison = client.helpers.get('prison');
    var _crime = client.helpers.get('crime');

    if (_date.isInTheFuture(prison.prison_time)) {
        message.channel.send(`You're still in prison for: ${_date.timeLeft(prison.prison_time)}`);
        return;
    }

    if (_date.isInTheFuture(crime.crime)) {
        message.channel.send(`You need to wait: ${_date.timeLeft(crime.crime)} before you can do this crime again.`);
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
            var _fail = Math.random() * 100;
            if (_fail > 50) {
                //take damage
                var damage = client.randomBetween(1,10);

                // check death
                var dead = _user.checkDeath(message, user_data.health, damage);
                if (dead) {
                    _user.initUser(message.author,true);
                    return;
                }

                user_data.health -= damage;
                return_message = `Failure. You've lost ${damage.toString()} health.`;
            } else {
                //send to prison
                prison.prison_time = _date.addSeconds(180);
                prison.escape_chance = true;
                return_message = `You've been send to prison. you're free in ${_date.timeLeft(prison.prison_time)}`;
            }

            break;
        default:
            console.log('wtf')
    }

    if (amount > 0) {
        user_data.cash += amount;
        user_data.exp += 10;
    }

    crime.crime = _date.addSeconds(60);

    message.channel.send(return_message);

    _user.updateUser(user_data);
    _crime.updateCrime(crime);
    _prison.updatePrison(prison);

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