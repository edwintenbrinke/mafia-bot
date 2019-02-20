const chalk = require('chalk');
module.exports = (client) => {
    console.log(chalk.bgGreen('I\'m online.'));
    //init all users
    var _user = client.helpers.get('user');
    client.users.array().forEach(function (user) {
        _user.initUser(user);
    });

    everyHour(client, _user);
};

function increaseAllOnlinePoints(_user, users, points) {
    users.array().forEach(function(user){
        if (user.bot) return;
        if (user.presence.status === "online" || user.presence.status === "dnd") {
            _user.updateUserPoints(user, points);
        }
    });
}

function everyHour(client, _user) {
    var current_time = new Date();
    if (current_time.getMinutes() === 0) {
        // code executed every hour
        // first initial run before the timer start
        increaseAllOnlinePoints(_user, client.users, 50);

        setInterval(
            function() {
                client.log("updating all points");
                increaseAllOnlinePoints(_user, client.users, 50);
            },
            (1000 * 60 * 60)
        );
    } else {
        var difference = (60 - current_time.getMinutes());
        client.log("sleeping for "+difference+" minutes.");
        setTimeout(
            function() {
                everyHour(client, _user);
            },
            difference * 60 * 1000
        );
    }

}