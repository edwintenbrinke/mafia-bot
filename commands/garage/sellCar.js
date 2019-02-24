const Garage = require('../../models/garage');
const User = require('../../models/user');

exports.run = async(client, message, msg) => {
    if (!parseInt(msg, 10)) return;
    //list all people in prison
    var _format = client.helpers.get('format');

    let car_int = parseInt(msg, 10);
    let car = await Garage.findOne({id: message.author.id, car_id: car_int});
    let user = await User.findOne({id: message.author.id});

    if (!car) {
        message.channel.send(`You don't have a car with the given ID. You can check your car's ID with !garage.`);
        return;
    }

    user.cash += car.price;

    message.channel.send(`You've succesfully sold your ${car.name} for ${_format.money(car.price)}`, {code: 'asciidoc'});

    car.delete();
    user.save();
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['sc'],
    permLevel: 0
};

exports.help = {
    name: "sellCard",
    description: "List of your cars in your garage",
    usage: "sellCard [car id]"
};