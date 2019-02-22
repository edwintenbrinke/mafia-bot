const ranks = {
    0:{'rank': 'Empty-Suit', 'exp': 0, 'prison_escape_chance': 10},
    1:{'rank': 'Deliveryboy', 'exp': 100, 'prison_escape_chance': 12.5},
    2:{'rank': 'Picciotto', 'exp': 200, 'prison_escape_chance': 15},
    3:{'rank': 'Shoplifter', 'exp': 400, 'prison_escape_chance': 17.5},
    4:{'rank': 'Pickpocket', 'exp': 800, 'prison_escape_chance': 20},
    5:{'rank': 'Thief', 'exp': 1600, 'prison_escape_chance': 22.5},
    6:{'rank': 'Associate', 'exp': 3200, 'prison_escape_chance': 25},
    7:{'rank': 'Mobster', 'exp': 6400, 'prison_escape_chance': 27.5},
    8:{'rank': 'Soldier', 'exp': 12800, 'prison_escape_chance': 30},
    9:{'rank': 'Swindler', 'exp': 25600, 'prison_escape_chance': 35},
    10:{'rank': 'Assassin', 'exp': 51200, 'prison_escape_chance': 40},
    11:{'rank': 'Local Chief', 'exp': 102400, 'prison_escape_chance': 50},
    12:{'rank': 'Chief', 'exp': 204800, 'prison_escape_chance': 60},
    13:{'rank': 'Bruglione', 'exp': 409600, 'prison_escape_chance': 75},
    14:{'rank': 'Godfather', 'exp': 819200, 'prison_escape_chance': 90}
};
module.exports = {
    name: "rank",
    getUserRank(user, extra = 0) {
        var current_rank;
        for (var key in ranks) {
            if (!ranks.hasOwnProperty(key)) continue;
            if ((user.exp + extra) <  ranks[key].exp) break;
            current_rank = ranks[key];
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
