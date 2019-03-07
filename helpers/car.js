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

        let new_car = {};
        new_car.name = car.name;
        new_car.image_path = car.image_path;
        new_car.car_id = user.crime.gta_counter;
        new_car.car_id += 1;
        new_car.damage = Math.round(Math.random() * (99 - 1) + 1);
        new_car.price = Math.round((car.price - (car.price * (new_car.damage/100))));
        return new_car;
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
    findOrignalCar(_car) {
        var tiers = Object.keys(cars);
        for (var tier in tiers) {
            for (var og_car in cars[tier]) {
                if (_car.name === cars[tier][og_car].name) return cars[tier][og_car];
            }
        }
    }
}