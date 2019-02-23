const mongoose = require('mongoose');

const garage_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    car_id: Number,
    name: String,
    image_path: String,
    price: Number,
    damage: Number
});

module.exports =  mongoose.model('garage', garage_schema);
