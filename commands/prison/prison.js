const fs = require('fs');
exports.run = (client, message, msg) => {
    //list all people in prison
    var _date = client.helpers.get('date');
    var prison_users = [];
    var paths = [];

    client.users.array().forEach(function(user){
        if (user.bot) return;
        //only check online/dnd people for efficiency
        if (user.presence.status === "online" || user.presence.status === "dnd") {
            paths.push('./users/' + user.id + '.json');
        }
    });

    paths.forEach(function(path){
        var result = fs.readFileSync(path, "utf8");
        var user_data = JSON.parse(result);
        if(_date.isInTheFuture(user_data.prison.time)) prison_users.push(JSON.parse(result));
    });

    if (prison_users.length === 0) {
        message.channel.send(`There are no people in prison!`, {code: 'asciidoc'});
        return;
    }

    message.channel.send(`= The following people are in prison =\n\n${prison_users.map(u => `${u.username} :: ${_date.timeLeft(u.prison.time)}`).join('\n')}`, {code: 'asciidoc'});
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