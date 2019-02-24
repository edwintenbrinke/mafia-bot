exports.run = async(client, message, msg) => {

    var _date = client.helpers.get('date');
    var _rank = client.helpers.get('rank');
    var _crime = client.helpers.get('crime');
    var _user = client.helpers.get('user');
    var _prison = client.helpers.get('prison');
    var _format = client.helpers.get('format');

    let user_data = await _user.getUserCrimePrison(message.author);

    if (_date.isInTheFuture(user_data.prison.prison_time)) {
        message.channel.send(`You're still in prison for: ${_date.timeLeft(user_data.prison.prison_time)}`);
        return;
    }

    if (_date.isInTheFuture(user_data.crime.org_crime)) {
        message.channel.send(`You need to wait: ${_date.timeLeft(user_data.crime.org_crime)} before you can do this crime again.`);
        return;
    }

    if (!_rank.isUserRank(user_data, 1)) {
        message.channel.send(`You need to be at least rank: ${_rank.getRankById(1).rank} to do this crime.`);
        return;
    }

    var return_message, amount;
    var awnser = Math.random() * 100;
    switch (true) {
        case (awnser < 2.5):
            amount = (client.randomBetween(750, 1500) * 5);
            return_message = "Jackpot! Your cash is "+_format.money((user_data.cash + amount).toString())+". You recieved " + _format.money(Math.round(amount));
            break;
        case (awnser <= _rank.getSpecificFromRankForUser('org_crime_chance', user_data)):
            amount = client.randomBetween(750, 1500);
            return_message = "Success! Your cash is "+_format.money((user_data.cash + amount).toString())+". You recieved " + _format.money(Math.round(amount));
            break;
        default:
            // ORG_CRIME FAILED
            var _fail = Math.random() * 100;
            if (_fail > 50) {
                var damage = client.randomBetween(1, 10);

                // check death
                var dead = _user.checkDeath(message, user_data.health, damage);
                if (dead) {
                    _user.initUser(message.author, true);
                    return;
                }

                user_data.health -= damage;
                return_message = `Failure. You've lost ${damage.toString()} health.`;
            } else {
                //send to prison
                user_data.prison.prison_time = _date.addSeconds(60*4);
                user_data.prison.escape_chance = true;
                return_message = `You've been send to prison. you're free in ${_date.timeLeft(user_data.prison.prison_time)}`;
            }
            break;
    }

    if (amount > 0) {
        user_data.cash += amount;
        if (_rank.getUserRank(user_data, 50).rank !== _rank.getUserRank(user_data).rank) message.channel.send(`You've ranked up! You're now: ${_rank.getUserRank(user_data, 50).rank}`);
        user_data.exp += 50;
        user_data.crime.org_crime_counter += 1;
    }

    user_data.crime.org_crime = _date.addSeconds(60 * 3);

    message.channel.send(return_message);

    _user.updateUser(user_data);
    _crime.updateCrime(user_data.crime);
    _prison.updatePrison(user_data.prison);

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
    usage: "orgCrime",
    category: "Crimes"
};