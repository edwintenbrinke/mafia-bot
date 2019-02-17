const ranks = {
    0:{'rank': 'Empty-Suit', 'exp': 0},
    1:{'rank': 'Deilveryboy', 'exp': 100},
    2:{'rank': 'Picciotto', 'exp': 200},
    3:{'rank': 'Shoplifter', 'exp': 400},
    4:{'rank': 'Pickpocket', 'exp': 800},
    5:{'rank': 'Thief', 'exp': 1600},
    6:{'rank': 'Associate', 'exp': 3200},
    7:{'rank': 'Mobster', 'exp': 6400},
    8:{'rank': 'Soldier', 'exp': 12800},
    9:{'rank': 'Swindler', 'exp': 25600},
    10:{'rank': 'Assassin', 'exp': 51200},
    11:{'rank': 'Local Chief', 'exp': 102400},
    12:{'rank': 'Chief', 'exp': 204800},
    13:{'rank': 'Bruglione', 'exp': 409600},
    14:{'rank': 'Godfather', 'exp': 819200}
};
module.exports = {
    name: "rank",
    getUserRank(user) {
        var current_rank;

        for (var key in ranks) {
            // skip loop if the property is from prototype
            if (!ranks.hasOwnProperty(key)) continue;

            if (user.exp <  ranks[key].exp) break;

            current_rank = ranks[key].rank;
        }

        return current_rank;
    },
    getRankById(rank_id) {
        return ranks[rank_id];
    },
    isUserRank(user, rank_id) {
        var rank = ranks[rank_id];
        return user.exp >= rank.exp
    }
};
