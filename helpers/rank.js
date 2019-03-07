const ranks = require('../settings/rank');
module.exports = {
    name: "rank",
    getRanks() {
        return ranks;
    },
    getUserRank(user, extra = 0) {
        var current_rank;
        for (var key in ranks) {
            if (!ranks.hasOwnProperty(key)) continue;
            if ((user.exp + extra) < ranks[key].exp) break;
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
    },
    getSpecificFromRankForUser(field, user) {
        var rank = this.getUserRank(user);
        return rank[field];
    }
}