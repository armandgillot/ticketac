var mongoose = require('mongoose');

var reservSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number
  });

var usersSchema = mongoose.Schema({
    username: String,
    userfirstname: String,
    email: String,
    password: String,
    reserv: [reservSchema]
  });
 
var usersModel = mongoose.model('users', usersSchema)
module.exports = usersModel;