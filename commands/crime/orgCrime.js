
const User = require('../../models/user');
const Crime = require('../../models/crime');
const Prison = require('../../models/prison');
exports.run = async(client, message, msg) => {
    let user_data = await User.findOne({id: message.author.id});
    let crime = await Crime.findOne({id: message.author.id});
    let prison = await Prison.findOne({id: message.author.id});

    var _user = client.helpers.get('user');
    var _date = client.helpers.get('date');
    var _rank = client.helpers.get('rank');
    var _crime = client.helpers.get('crime');

    if (_date.isInTheFuture(prison.time)) {
        message.channel.send(`You're still in prison for: ${_date.timeLeft(prison.time)}`);
        return;
    }

    if (_date.isInTheFuture(crime.org_crime)) {
        message.channel.send(`You need to wait: ${_date.timeLeft(crime.org_crime)} before you can do this crime again.`);
        return;
    }

    if (!_rank.isUserRank(user_data, 1)) {
        message.channel.send(`You need to be at least rank: ${_rank.getRankById(1).rank} to do this crime.`)
        return;
    }

    var return_message, amount;
    var awnser = Math.random() * 100;
    switch (true) {
        case (awnser > 97.5):
            amount = (client.randomBetween(750, 1500) * 5);
            return_message = "Jackpot! Your cash is $"+(user_data.cash + amount).toString()+". You recieved $" + Math.round(amount);
            break;
        case (awnser >= 40):
            amount = client.randomBetween(750, 1500);
            return_message = "Success! Your cash is $"+(user_data.cash + amount).toString()+". You recieved $" + Math.round(amount);
            break;
        case (awnser < 40):
            var damage = client.randomBetween(1,10);

            // check death
            var dead = _user.checkDeath(message, user_data.health, damage);
            if (dead) {
                _user.initUser(message.author,true);
                return;
            }

            user_data.health -= damage;
            return_message = `Failure. You've lost ${damage.toString()} health.`;
            break;
        default:
            console.log('wtf')
    }

    if (amount > 0) {
        user_data.cash += amount;
        user_data.exp += 50;
    }

    crime.org_crime = _date.addSeconds(180);

    message.channel.send(return_message);

    _user.updateUser(user_data);
    _crime.updateCrime(crime);

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['oc'],
    permLevel: 0
};

exports.help = {
    name: "orgCrime",
    description: "Do an organised crime.",
    usage: "orgCrime"
};