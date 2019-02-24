const Garage = require('../../models/garage');

exports.run = async(client, message, msg) => {
    //list all people in prison
    var _format = client.helpers.get('format');

    let res = await Garage.find({id:message.author.id, car_id: {$ne: 0}});

    if (res.length === 0) {
        message.channel.send(`You have no cars in your garage.`, {code: 'asciidoc'});
        return;
    }

    var names = [];
    var price = [];
    res.map((car) => {
        names.push(car.name);
        price.push(_format.money(car.price));
    });

    const longest = names.reduce((long, str) => Math.max(long, str.length), 0);
    const longest_price = price.reduce((long, str) => Math.max(long, str.length), 0);
    message.channel.send(`= You have the following cars =\n\n${res.map(d => `${d.name}${' '.repeat(longest - d.name.length)} :: ${d.car_id} :: ${_format.money(d.price)}${' '.repeat(longest_price - _format.money(d.price).length)} :: ${d.damage}%`).join('\n')}`, {code: 'asciidoc'});
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['g'],
    permLevel: 0
};

exports.help = {
    name: "garage",
    description: "List of your cars in your garage.",
    usage: "garage",
    category: "Car"
};