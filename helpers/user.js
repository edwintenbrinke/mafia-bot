//TODO: figure out how to get file out of here
const fs = require('fs');
const User = require('../models/user');
const mongoose = require('mongoose');
const settings = require('../settings');
module.exports = {
    name: "user",
    writeFile(path, data) {
        fs.writeFile(path, data, 'utf8', function (err) {
            if (err) {
                console.log(err);
                this.writeFile(path, data);
            }
        });
    },
    initUser: async function(author, reset = false) {
        if (author.bot) return;

        mongoose.connect('mongodb://localhost/user', {useNewUrlParser: true});

        let user_data = await User.findOne({
            id: author.id
        });

        if (user_data && !reset) {
            return;
        }

        if (reset) {
            await User.deleteOne({
                id: author.id
            });
        }

        const user = new User({
            _id: mongoose.Types.ObjectId(),
            username: author.username,
            id: author.id,
            cash: 0,
            exp: 0,
            health: 100
        });

        user.save();
    },
    updateUserPoints(user, points) {
        let path = './users/' + user.id + '.json';

        fs.readFile(path, 'utf8', function (err,raw_user_data) {
            if (err) return console.log(err);
            var user_data = JSON.parse(raw_user_data);

            user_data.cash += points;

            fs.writeFile(path, JSON.stringify(user_data), 'utf8', function (err) {
                if (err) console.log(err);
            });
        });
    },
    updateUserHealthAndCash(user, health, cash) {
        let path = './users/' + user.id + '.json';

        fs.readFile(path, 'utf8', function (err,raw_user_data) {
            if (err) return console.log(err);
            var user_data = JSON.parse(raw_user_data);

            user_data.health = health;
            user_data.cash = cash;

            fs.writeFile(path, JSON.stringify(user_data), 'utf8', function (err) {
                if (err) console.log(err);
            });
        });
    },
    updateUser(user){
        let path = './users/' + user.id + '.json';

        fs.writeFile(path, JSON.stringify(user), 'utf8', function (err) {
            if (err) console.log(err);
        });
    },
    checkDeath(message, health, damage) {
        var new_health = health - damage;
        if (new_health <= 0) {
            message.channel.send("You have died... All your progress has reset.");
            return true;
        }
        return false;
    }
}
