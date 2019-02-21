const fs = require('fs');
exports.run = async(client, message, msg) => {
    //list all people in prison
    var _date = client.helpers.get('date');
    var _rank = client.helpers.get('rank');
    var _user = client.helpers.get('user');
    var _prison = client.helpers.get('prison');
    let target_id = null;
    var ids = [message.author.id];

    var regex = new RegExp('^<@(?<id>.\\d*)>$');
    if (regex.test(msg)) {
        ids.push(regex.exec(msg).groups.id);
        target_id = regex.exec(msg).groups.id;
    }

    let users = await _prison.getUsersById(ids);
    if (users.length === 2 && users[0].id === users[1].id) {
        target_id = null;
    }

    var author = _user.getUserOutOfArray(users, message.author.id);
    var awnser = Math.random()*100;
    var user_rank = _rank.getUserRank(author);
    //if no msg
    if (target_id === null) {
        if (!_date.isInTheFuture(author.prison_time)) {
            message.channel.send(`You're not even in prison silly.`);
            return;
        }

        if (!author.escape_chance) {
            message.channel.send(`You already tried to escape, the guards have you under 24/7 monitoring now.`, {code: 'asciidoc'});
            return;
        }
        //try to break yourself out
        if(awnser <= user_rank.prison_escape_chance) {
            author.prison_time = new Date();
            author.exp += 25;
            message.channel.send(`You have successfully broken yourself out of prison.`, {code: 'asciidoc'});
        } else {
            //increase prison time 5mins 60 & 5
            author.prison_time = _date.addSeconds(60*5, author.prison_time);
            author.escape_chance = false;
            message.channel.send(`You failed in breaking yourself out. You're now in prison for: ${_date.timeLeft(author.prison_time)}`, {code: 'asciidoc'})
        }
    } else {
        let target = _user.getUserOutOfArray(users, target_id);

        if (!_date.isInTheFuture(target.prison_time)) {
            message.channel.send(`${target.username} is not in prison.`, {code: 'asciidoc'});
            return;
        }

        //check if author is not in prison
        if (_date.isInTheFuture(author.prison_time)) {
            message.channel.send(`You're still in prison for: ${_date.timeLeft(author.prison_time)}`, {code: 'asciidoc'});
            return;
        }

        if(awnser <= (user_rank.prison_escape_chance+10)) {
            target.prison_time = new Date();
            author.exp += 25;
            message.channel.send(`You have successfully broken ${target.username} out of prison.`, {code: 'asciidoc'});
        } else {
            //increase prison time 5mins 60 & 5
            author.prison_time = _date.addSeconds(60*3);
            author.escape_chance = true;
            message.channel.send(`You failed in breaking ${target.username} out. You're now in prison for: ${_date.timeLeft(author.prison_time)}`, {code: 'asciidoc'})
        }
    }

    users.forEach(function (prison) {
        _prison.updatePrison(prison);
        _user.updateUser(prison.user);
    });

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
