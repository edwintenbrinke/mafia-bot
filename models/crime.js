const mongoose = require('mongoose');

const crime_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    crime: Date,
    crime_counter: Number,
    org_crime: Date,
    org_crime_counter: Number,
    gta: Date,
    gta_counter: Number
});

module.exports =  mongoose.model('crime', crime_schema);
