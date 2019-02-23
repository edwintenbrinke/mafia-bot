const cars = require('../settings/car');
const Garage = require('../models/garage');
module.exports = {
    name: "car",
    stealCar(rank, user) {
        //get a car based on rank
        var car, keys;
        var awnser = Math.random() * 100;
        switch (true) {
            // check if highest tier
            case (awnser < rank.gta_class[2]):
                //specific BestInSlot car 5% chance in the tier 3
                var second_awnser = Math.random() * 100;
                if (second_awnser < 5) {
                    car = cars[3][0];
                } else {
                    keys = Object.keys(cars[2]);
                    car = cars[2][keys[ keys.length * Math.random() << 0]];
                }
                break;
            // check if second tier
            case (awnser < rank.gta_class[1]):
                keys = Object.keys(cars[1]);
                car = cars[1][keys[ keys.length * Math.random() << 0]];
                break;
            // default tier
            default:
                keys = Object.keys(cars[0]);
                car = cars[0][keys[ keys.length * Math.random() << 0]];
        }
        
        car.car_id = user.crime.gta_counter;
        car.damage = Math.round(Math.random() * (99 - 1) + 1);
        car.price = (car.price - Math.round(car.price * (car.damage/100)));
        return car;
    },

    async countCars(author) {
        let result = await Garage.aggregate(
            [
                {$match: {id: author.id}},
                {$count: "cars"}
            ]
        );

        return result[0].cars;
    },
    async isGarageFull(user) {
        let amount = await this.countCars(user);
        return amount > 10;
    },
}