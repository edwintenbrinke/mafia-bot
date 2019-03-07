const Discord = require('discord.js');
const Garage = require('../../models/garage');
const mongoose = require('mongoose');
exports.run = async(client, message, msg) => {
    // max 10 cars
    // tiers of cars based on rank

    var _user = client.helpers.get('user');
    var _date = client.helpers.get('date');
    var _prison = client.helpers.get('prison');
    var _crime = client.helpers.get('crime');
    var _format = client.helpers.get('format');
    var _rank = client.helpers.get('rank');
    var _car = client.helpers.get('car');

    let user_data = await _user.getUserCrimePrison(message.author);

    if (_date.isInTheFuture(user_data.prison.prison_time)) {
        message.channel.send(`You're still in prison for: ${_date.timeLeft(user_data.prison.prison_time)}`);
        return;
    }

    if (_date.isInTheFuture(user_data.crime.gta)) {
        message.channel.send(`You need to wait: ${_date.timeLeft(user_data.crime.gta)} before you can do this crime again.`);
        return;
    }
    if (true === await _car.isGarageFull(user_data)) {
        message.channel.send(`Your garage is full. You need to sell some cars first.`);
        return;
    }

    var return_message, new_car;
    var awnser = Math.random() * 100;
    switch (true) {
        case (awnser <= _rank.getSpecificFromRankForUser('gta_chance', user_data)):
            // You've stolen a new_car.
            new_car = _car.stealCar(_rank.getUserRank(user_data),user_data);

            return_message = new Discord.RichEmbed()
                .setColor("#0000ff")
                .setThumbnail(`http://www.edwintenbrinke.nl/images/cars/${new_car.image_path}`)
                .addField("Car", new_car.name, true)
                .addField("Price", _format.money(new_car.price), true)
                .addField("Damage", `${new_car.damage}%`, true)
                .addField('Id', new_car.car_id, true);
            break;
        default:
            // GTA FAILED
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
                user_data.prison.prison_time = _date.addSeconds(60*3);
                user_data.prison.escape_chance = true;
                return_message = `You've been send to prison. you're free in ${_date.timeLeft(user_data.prison.prison_time)}`;
            }

            break;
    }

    if (new_car) {
        // user_data.cash += amount;
        if (_rank.getUserRank(user_data, 50).rank !== _rank.getUserRank(user_data).rank) message.channel.send(`You've ranked up! You're now: ${_rank.getUserRank(user_data, 50).rank}`);
        user_data.exp += 50;
        user_data.crime.gta_counter += 1;

        const garage = new Garage({
            _id: mongoose.Types.ObjectId(),
            id: message.author.id,
            car_id: new_car.car_id,
            name: new_car.name,
            image_path: new_car.image_path,
            price: new_car.price,
            damage: new_car.damage
        });

        garage.save();
    }

    user_data.crime.gta = _date.addSeconds(60*2.5);

    message.channel.send(return_message);

    _user.updateUser(user_data);
    _crime.updateCrime(user_data.crime);
    _prison.updatePrison(user_data.prison);

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['gta'],
    permLevel: 0
};

exports.help = {
    name: "grandTheftAuto",
    description: "Try to steal a car.",
    usage: "grandTheftAuto",
    category: "Crimes"
};