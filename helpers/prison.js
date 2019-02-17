module.exports = {
    name: "prison",
    getIfInPrison: function(user) {
        let path = './users/' + user.id + '.json';
        fs.readFile(path, 'utf8', function (err,raw_user_data) {
            if (err) return console.log(err);
            var user_data = JSON.parse(raw_user_data);

        });


    }
}
