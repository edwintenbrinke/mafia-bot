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
    initUser: function(author, reset = false) {
        if (author.bot) return;
        // let path = './users/' + author.id + '.json';
        //
        // var now = new Date();
        // let user_data = {
        //     "id": author.id,
        //     "username": author.username,
        //     "cash": 0,
        //     "exp": 0,
        //     "health": 100,
        //     "crime": now,
        //     "org_crime": now,
        //     "prison": {
        //         "time": now,
        //         "escape_chance": false
        //     }
        // };
        //
        // fs.exists(path, (exists) => {
        //     if (!exists || reset) {
        //         fs.writeFile(path, JSON.stringify(user_data), 'utf8', function (err) {
        //             if (err) console.log(err);
        //         });
        //         console.log('Successfully written user file for '+ author.username);
        //     }
        // })


        mongoose.connect('mongodb://localhost/user', {useNewUrlParser: true});

        //Step 1: declare promise
        if (author.id !== settings.ownerid) return;
        User.findOne({
            userID: author.id
        }, (err, user) => {
            console.log(user)
        });

        var myPromise = () => {
            return new Promise((resolve, reject) => {
                User.findOne({
                    userID: author.id
                }, (err, user) => {
                   err
                       ? reject(err)
                       : resolve(user)
                });
            });
        };

        //Step 2: async promise handler
        var callMyPromise = async () => {
            return await (myPromise());
        };

        let user;
        //Step 3: make the call
        callMyPromise().then(function(result) {
            console.log(result);
            user = result;
        });


        if (author.id === settings.ownerid) console.log(user);
        //if (callMyPromise) return console.log('already exists');
        const new_user = new User({
            _id: mongoose.Types.ObjectId(),
            username: author.username,
            id: author.id,
            cash: 0,
            exp: 0,
            health: 100
        });



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
