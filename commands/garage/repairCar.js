const Garage = require('../../models/garage');
const User = require('../../models/user');

exports.run = async(client, message, msg) => {
    if (!parseInt(msg, 10)) return;
    //list all people in prison
    var _format = client.helpers.get('format');
    var _car = client.helpers.get('car');

    let car_int = parseInt(msg, 10);
    let car = await Garage.findOne({id: message.author.id, car_id: car_int});
    let user = await User.findOne({id: message.author.id});

    if (!car) {
        message.channel.send(`You don't have a car with the given ID. You can check your car's ID with !garage.`);
        return;
    }

    if (car.damage === 0) {
        message.channel.send(`Your car is already in perfect condition.`)
    }

    var original_car = _car.findOrignalCar(car);
    var cost = original_car.price - car.price;

    if (user.cash < cost) {
        message.channel.send(`You don't have enough cash to repair this car. It will cost ${_format.money(cost)}.`)
        return;
    }

    user.cash -= cost;
    car.price = original_car.price;
    car.damage = 0;

    message.channel.send(`You've successfully repaired your ${car.name} for ${_format.money(cost)}. Its now worth ${_format.money(car.price)}`, {code: 'asciidoc'});

    car.save();
    user.save();
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['rc'],
    permLevel: 0
};

exports.help = {
    name: "repairCar",
    description: "Repair a car fully.%",
    usage: "repairCar [car id]",
    category: "Car"
};