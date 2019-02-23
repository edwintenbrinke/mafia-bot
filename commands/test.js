const User = require('../models/user');
const mongoose = require('mongoose');
const Prison = require('../models/prison');
const Crime = require('../models/crime');
const Garage = require('../models/garage');
const Discord = require('discord.js');

exports.run = async(client, message, msg) => {

    // var _rank = client.helpers.get('rank');
    // return;
    //
    // let prisons = await Prison.find();
    //
    // prisons.forEach(function (prison) {
    //     prison.breakout_counter = 0;
    //     prison.save();
    // });


    let crimes = await Crime.find();

    crimes.forEach(function (crime) {
        crime.gta = new Date();
        crime.gta_counter = 0;
        crime.save();

        const garage = new Garage({
            _id: mongoose.Types.ObjectId(),
            id: crime.id,
            car_id: 0,
            name: '',
            image_path: '',
            damage: 0
        });

        garage.save();
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
