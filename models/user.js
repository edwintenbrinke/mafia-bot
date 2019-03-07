const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    id: String,
    health: Number,
    cash: Number,
    exp: Number
});

module.exports =  mongoose.model('user', user_schema);
