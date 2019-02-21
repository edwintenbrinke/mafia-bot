const Crime = require('../models/crime');

module.exports = {
    name: "crime",
    async updateCrime(crime) {
        await Crime.updateOne({
            id: crime.id
        }, crime);
    },
    async updateCrimes(crimes) {
        await Crime.update({
            id: {$in: crimes.map}
        }, crime);
    }
}
