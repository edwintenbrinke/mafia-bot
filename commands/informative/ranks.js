exports.run = async(client, message, msg) => {
    var _rank = client.helpers.get('rank');

    let ranks = _rank.getRanks();
    let rank_arr = [];
    Object.keys(ranks).forEach(function(key) {
        rank_arr.push(ranks[key]);
    });

    message.author.send(`= List of all the ranks =\n\n${rank_arr.map(r => `${r.rank}`).join('\n')}`, {code: 'asciidoc'});
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['levels'],
    permLevel: 0
};

exports.help = {
    name: "ranks",
    description: "Get a list of all the ranks.",
    usage: "ranks"
};