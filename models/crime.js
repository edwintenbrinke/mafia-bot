const mongoose = require('mongoose');

const crime_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    crime: Date,
    org_crime: Date,
});

module.exports =  mongoose.model('crime', crime_schema);
