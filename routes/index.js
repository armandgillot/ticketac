const { render } = require('ejs');
var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
var usersModel = require('../models/users');

// useNewUrlParser ;)
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// --------------------- BDD -----------------------------------------------------
mongoose.connect('mongodb+srv://armandgillot:jyd1Y3XNIDCqoi7Q@cluster0.gif5n.mongodb.net/hackathon?retryWrites=true&w=majority',
  options,
  function (err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Ticketac connection : Success ***');
    }
  }
);

var journeySchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number,
});

var journeyModel = mongoose.model('journey', journeySchema);

var city = ["Paris", "Marseille", "Nantes", "Lyon", "Rennes", "Melun", "Bordeaux", "Lille"]
var date = ["2018-11-20", "2018-11-21", "2018-11-22", "2018-11-23", "2018-11-24"]
var searchResult = false;
// ROUTES----------------------------------------------------------------------------------------

/* GET home page. */
router.get('/', async (req, res, next) => {
  if(req.session.user){
    searchResult = false;
    res.render('index', {searchResult})
  }
  res.render('sign');
});

// RESULT
router.post('/result', async (req, res, next) => {
  searchResult = await journeyModel.find({ departure: req.body.depart, arrival: req.body.destination, date: req.body.date });
  res.render('index', { searchResult });
});

/* GET home page. */
router.get('/addBasket', async (req, res, next) => {
  ticket = await journeyModel.findOne({ _id: req.query.id })
  console.log(ticket);
  addTicket = await usersModel.find({_id: req.session.user.id})
  console.log(addTicket);
  addTicket[0].reserv.push({
      departure: ticket.departure,
      arrival: ticket.arrival,
      date: ticket.date,
      departureTime: ticket.departureTime,
      price: ticket.price
  })
  var addTicketSaved = await addTicket[0].save()

  res.redirect('/basket');
});

/* GET BASKET. */
router.get('/basket', async (req, res, next) => {

  var user = await usersModel.findById(req.session.user.id)
  var listeVoyage = user.reserv

  res.render('basket', {listeVoyage});
});


// route connexion - utilisateur a déjà un compte dans l'app 
router.post('/sign-in', async function (req, res, next) {
  var searchUser = await usersModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  if (searchUser != null) {
    req.session.user = {
      name: searchUser.username,
      id: searchUser._id
    }
    console.log(req.session.user.id);
    res.render('index', { searchResult })
  } else {  //sinon 
    res.render('/')
  }
});

router.post('/sign-up', async (req, res, next) => {

  if (await usersModel.findOne({ email: req.body.emailFromFront })) {
    res.redirect('/');
  } else {
    var newUsers = new usersModel({
      username: req.body.usernameFromFront,
      userfirstname: req.body.userfirstnameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    });
    var usersSaved = await newUsers.save();

    req.session.user = { name: newUsers.username, id: newUsers._id };

    res.render('index', {searchResult});
  }
});

module.exports = router;