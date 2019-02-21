const Prison = require('../models/prison');
module.exports = {
    name: "prison",
    async getAllUsersInPrison() {
        return await Prison.aggregate([
            {
                $match: {prison_time: {$gte: new Date()}}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "id",
                    foreignField: "id",
                    as: "prison"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$prison", 0 ] }, "$$ROOT" ] } }
            },
            { $project: { prison: 0 } }
        ]);
    },
    async getUsersById(ids) {
        return await Prison.aggregate([
            {
                $match: {id: {$in: ids}}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "id",
                    foreignField: "id",
                    as: "user"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$user", 0 ] }, "$$ROOT" ] } }
            }
        ]);
    },
    async updatePrison(prison) {
        await Prison.updateOne({
            id: prison.id
        }, prison);
    }
}
