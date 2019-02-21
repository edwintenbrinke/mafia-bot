const mongoose = require('mongoose');

const crime_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    prison_time: Date,
    escape_chance: Boolean,
});

module.exports =  mongoose.model('prison', crime_schema);
