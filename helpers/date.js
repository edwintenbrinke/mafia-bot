var moment = require('moment');
module.exports = {
    name: "date",
    addSeconds: function(seconds, date) {
        if(date === null) date = new Date();
        return moment(date).add(seconds, 's');
    },
    isInTheFuture: function(_dt) {
        var dt = new Date(_dt);
        var t = new Date();
        return dt > t;
    },
    timeLeft: function(_dt) {
       var now = new Date().getTime();
       var future = new Date(_dt).getTime();

       var timeRemaining = parseInt((future - now) / 1000);

        if (timeRemaining < 0) {
            return false;
        }

        var zero = new Date().setTime(0);
        return moment(zero).seconds(timeRemaining).format('mm:ss');
    }
}
