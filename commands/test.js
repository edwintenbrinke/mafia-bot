const User = require('../models/user');
const mongoose = require('mongoose');
const Prison = require('../models/prison');
const Crime = require('../models/crime');
const Discord = require('discord.js');

exports.run = async(client, message, msg) => {


    let prisons = await Prison.find();

    prisons.forEach(function (prison) {
        prison.breakout_counter = 0;
        prison.save();
    });

    let crimes = await Crime.find();

    crimes.forEach(function (crime) {
        crime.crime_counter = 0;
        crime.org_crime_counter = 0;
        crime.save();
    });

    message.channel.send("All data models have been updated.");
    return;



};



exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['t'],
    permLevel: 4
};

exports.help = {
    name: "test",
    description: "test",
    usage: "test"
};
