const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);


client.log = (msg) => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.helpers = new Discord.Collection();
client.randomBetween = function randomBetween(max, min) { return Math.floor(Math.random() * (max - min + 1) ) + min; };

function addCommands(dir) {
    var list = fs.readdirSync(dir);
    list.forEach(function(f) {
        var dir_file = dir + f + '/';
        if (dir_file.substr(dir_file.length -4) === '.js/') dir_file = dir_file.substr(0, dir_file.length-1);

        var stat = fs.statSync(dir_file);
        if (stat && stat.isDirectory()) {
            addCommands(dir_file);
        } else {
            if (f.substr(f.length -3) !== '.js') return;
            let props = require(`${dir}${f}`);
            client.log(`Loading command: "${props.help.name}"...`);
            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name)
            });
        }
    });
}

addCommands('./commands/');

fs.readdir('./helpers/', (err, files) => {
    if (err) console.error(err);
    client.log(`Loading a total of ${files.length} helpers.`);
    files.forEach(f => {
        if (f.substr(f.length -3) !== '.js') return;
        let prop = require(`./helpers/${f}`);
        client.log(`Loading helper: "${prop.name}"...`);
        client.helpers.set(prop.name,prop);
    });
});

client.reload = function(command) {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./commands/${command}`)];
            let cmd = require(`./commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        }   catch (e){
            reject (e);
        }
    });
};

client.elevation = function(msg) {
    /* This function should resolve to an ELEVATION level which
       is then sent to the command handler for verification*/
    let permlvl = 0;
    // let mod_role = msg.guild.roles.find('name', settings.modroleid);
    // if (mod_role && msg.member.roles.has(mod_role.id)) permlvl = 2;
    // let admin_role = msg.guild.roles.find('name', settings.adminroleid);
    // if (admin_role && msg.member.roles.has(admin_role.id)) permlvl = 3;
    if (msg.author.id === settings.ownerid) permlvl = 4;
    return permlvl;
};


// var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//     console.log(chalk.bgBlue(e.replace(regToken, 'that was redacted')));
//  });
//
// client.on('warn', e => {
//     console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
// });
//
// client.on('error', e => {
//     console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
// });

client.login(settings.token);