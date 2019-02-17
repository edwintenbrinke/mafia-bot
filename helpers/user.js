//TODO: figure out how to get file out of here
const fs = require('fs');
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
    initUser: function(user) {
        if (user.bot) return;
        let path = './users/' + user.id + '.json';

        var now = new Date();
        let user_data = {
            "id": user.id,
            "cash": 0,
            "exp": 0,
            "health": 100,
            "crime": now
        };

        fs.exists(path, (exists) => {
            if (!exists) {
                fs.writeFile(path, JSON.stringify(user_data), 'utf8', function (err) {
                    if (err) console.log(err);
                });
                console.log('Successfully written user file for '+ user.username);
            }
        })
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

            user_data.health = health
            user_data.cash = cash;

            fs.writeFile(path, JSON.stringify(user_data), 'utf8', function (err) {
                if (err) console.log(err);
            });
        });
    }

}
