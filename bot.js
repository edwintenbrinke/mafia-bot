const Discord = require("discord.js");
const fs = require('fs');

const client = new Discord.Client();

const config = require("./auth.json");

function writeFile(path, data) {
    fs.writeFile(path, data, 'utf8', function (err) {
        if (err) {
            console.log(err);
            writeFile(path, data);
        }
    });
}

function initUser(user) {
    if (user.bot) return;
    let path = './users/' + user.id + '.json';

    let user_data = {
        "id": user.id,
        "username": user.username,
        "cash": 0
    };

    fs.exists(path, (exists) => {
        if (!exists) {
            fs.writeFile(path, JSON.stringify(user_data), function(err, data){
                if (err) console.log(err);
                else console.log('Successfully written user file for '+ user.username);
            });
        }
    })
}

function updateUserPoints(user, points) {
    let path = './users/' + user.id + '.json';

    fs.readFile(path, 'utf8', function (err,raw_user_data) {
        if (err) return console.log(err);
        var user_data = JSON.parse(raw_user_data);

        user_data.cash += points;

        writeFile(path, JSON.stringify(user_data));
    });
}

function increaseAllOnlinePoints(users, points) {
    users.array().forEach(function(user){
        if (user.bot) return;
        if (user.presence === "online" || user.presence === "dnd") return console.log(user.username + " no points. " + user.presence);

        updateUserPoints(user, points);
    });
}

function sendUserData(channel, user) {
    let path = './users/' + user.id + '.json';
    fs.readFile(path, 'utf8', function (err,raw_user_data) {
        if (err) return console.log(err);
        var user_data = JSON.parse(raw_user_data);

        channel.send('User: ' + user.username + '\nCash: $' + user_data.cash);
    });
}

function gambleFiftyFifty(channel, user, message) {
    if (!parseInt(message, 10)) return console.log("no numeric");

    let path = './users/' + user.id + '.json';
    fs.readFile(path, 'utf8', function (err,raw_user_data) {
        if (err) return console.log(err);
        var user_data = JSON.parse(raw_user_data);

        var amount = parseInt(message, 10);

        if (amount < 0 || amount === Infinity) return;

        if (user_data.cash < amount) {
            channel.send('You don\'t have enough cash, you have $'+user_data.cash.toString());
            return;
        }

        var return_message;
        var awnser = Math.random()*100;
        switch(true) {
            case (awnser > 99):
                amount *= 10;
                return_message = "Jackpot!";
                break;
            case (awnser >= 50):
                return_message = "You won!";
                break;
            case (awnser < 50):
                amount = amount * -1;
                return_message = "You lost.";
                break;
            default:
                console.log('wtf')
        }

        user_data.cash += amount;

        channel.send(return_message + " Your cash is $"+user_data.cash.toString()+". You rolled a " + Math.round(awnser));

        writeFile(path, JSON.stringify(user_data));
    });

}

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`Serving ${client.guilds.size} servers`);

    client.users.array().forEach(function (user) {
        initUser(user);
    })
});

client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildMemberAdd", user => {
   initUser(user);
});

client.on("message", async message => {
    if(message.author.bot) return;

    if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "test") {
        console.log(message.author.username, message.author.id);
    }

    if(command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    if(command === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send(sayMessage);
    }

    if(command === "p") {
        updateUserPoints(message.author, 50);
    }

    if(command === "i") {
        sendUserData(message.channel, message.author);
    }

    if(command === "a") {
        increaseAllOnlinePoints(client.users, 5);
    }

    if(command === "g50") {
        gambleFiftyFifty(message.channel, message.author, args.join(" "))
    }
});

client.login(config.token);
