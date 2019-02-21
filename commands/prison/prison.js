const Prison = require('../../models/prison');
const User = require('../../models/user');
exports.run = async(client, message, msg) => {
    //list all people in prison
    var _date = client.helpers.get('date');
    var _prison = client.helpers.get('prison');

    let res = await _prison.getAllUsersInPrison();

    if (res.length === 0) {
        message.channel.send(`There are no people in prison!`, {code: 'asciidoc'});
        return;
    }

    message.channel.send(`= The following people are in prison =\n\n${res.map(d => `${d.username} :: ${_date.timeLeft(d.prison_time)}`).join('\n')}`, {code: 'asciidoc'});
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['p'],
    permLevel: 0
};

exports.help = {
    name: "prison",
    description: "List of people in prison",
    usage: "prison"
};