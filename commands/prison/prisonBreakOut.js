const fs = require('fs');
exports.run = (client, message, msg) => {
    //list all people in prison
    var _date = client.helpers.get('date');
    var _rank = client.helpers.get('rank');
    var _user = client.helpers.get('user');
    var paths = [`./users/${message.author.id}.json`];
    var users = [];
    var bust_out = false;

    var regex = new RegExp('^<@(?<id>.\\d*)>$');
    if (regex.test(msg)) {
        paths.push(`./users/${regex.exec(msg).groups.id}.json`);
        bust_out = true;
    }

    paths.forEach(function(path){
        var result = fs.readFileSync(path, "utf8");
        var user_data = JSON.parse(result);

        users.push(user_data);
    });

    if (users.length === 2 && users[0].id === users[1].id) {
        bust_out = false;
    }

    var author = users[0];
    var awnser = Math.random()*100;
    var user_rank = _rank.getUserRank(author);
    //if no msg
    if (!bust_out) {
        if (!author.prison.escape_chance) {
            message.channel.send(`You already tried to escape, the guards have you under 24/7 monitoring now.`, {code: 'asciidoc'});
            return;
        }
        //try to break yourself out
        if(awnser <= user_rank.prison_escape_chance) {
            author.prison.time = new Date();
            message.channel.send(`You have successfully broken yourself out of prison.`, {code: 'asciidoc'});
        } else {
            //increase prison time 5mins 60 & 5
            author.prison.time = _date.addSeconds(60*5, author.prison.time);
            author.prison.escape_chance = false;
            message.channel.send(`You failed in breaking yourself out. You're now in prison for: ${_date.timeLeft(author.prison.time)}`, {code: 'asciidoc'})
        }
    } else {
        var target = users[1];

        if (!_date.isInTheFuture(target.prison.time)) {
            message.channel.send(`${target.username} is not in prison.`, {code: 'asciidoc'});
            return;
        }

        //check if author is not in prison
        if (_date.isInTheFuture(author.prison.time)) {
            message.channel.send(`You're still in prison for: ${_date.timeLeft(author.prison.time)}`, {code: 'asciidoc'});
            return;
        }

        if(awnser <= (user_rank.prison_escape_chance+10)) {
            target.prison.time = new Date();
            message.channel.send(`You have successfully broken ${target.username} out of prison.`, {code: 'asciidoc'});
        } else {
            //increase prison time 5mins 60 & 5
            author.prison.time = _date.addSeconds(60*3);
            author.prison.escape_chance = true;
            message.channel.send(`You failed in breaking ${target.username} out. You're now in prison for: ${_date.timeLeft(author.prison.time)}`, {code: 'asciidoc'})
        }
    }

    users.forEach(function (user) {
        _user.updateUser(user);
    })
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['pbo'],
    permLevel: 0
};

exports.help = {
    name: "prisonBreakOut",
    description: "Try to break yourself or someone out of prison.",
    usage: "prisonBreakOut [@username]"
};