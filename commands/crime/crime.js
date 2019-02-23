exports.run = async(client, message, msg) => {
    var _user = client.helpers.get('user');
    var _date = client.helpers.get('date');
    var _prison = client.helpers.get('prison');
    var _crime = client.helpers.get('crime');
    var _format = client.helpers.get('format');
    var _rank = client.helpers.get('rank');

    let user_data = await _user.getUserCrimePrison(message.author);

    if (_date.isInTheFuture(user_data.prison.prison_time)) {
        message.channel.send(`You're still in prison for: ${_date.timeLeft(user_data.prison.prison_time)}`);
        return;
    }

    if (_date.isInTheFuture(user_data.crime.crime)) {
        message.channel.send(`You need to wait: ${_date.timeLeft(user_data.crime.crime)} before you can do this crime again.`);
        return;
    }

    var return_message, amount;
    var awnser = Math.random() * 100;
    switch (true) {
        case (awnser < 2.5):
            amount = (client.randomBetween(100, 250) * 10);
            return_message = "Jackpot! Your cash is "+_format.money((user_data.cash + amount).toString())+". You recieved " + _format.money(Math.round(amount));
            break;
        case (awnser <= _rank.getSpecificFromRankForUser('crime_chance', user_data)):
            amount = client.randomBetween(100, 250);
            return_message = "Success! Your cash is "+_format.money((user_data.cash + amount).toString())+". You recieved " + _format.money(Math.round(amount));
            break;
        default:
            // CRIME FAILED
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
                user_data.prison.prison_time = _date.addSeconds(60*2);
                user_data.prison.escape_chance = true;
                return_message = `You've been send to prison. you're free in ${_date.timeLeft(user_data.prison.prison_time)}`;
            }

            break;
    }

    if (amount > 0) {
        user_data.cash += amount;
        if (_rank.getUserRank(user_data, 10).rank !== _rank.getUserRank(user_data).rank) message.channel.send(`You've ranked up! You're now: ${_rank.getUserRank(user_data, 10).rank}`);
        user_data.exp += 10;
        user_data.crime.crime_counter += 1;

    }

    user_data.crime.crime = _date.addSeconds(60);

    message.channel.send(return_message);

    _user.updateUser(user_data);
    _crime.updateCrime(user_data.crime);
    _prison.updatePrison(user_data.prison);

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