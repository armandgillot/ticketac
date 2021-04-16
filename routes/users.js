var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
var usersModel = require('../models/users');
var searchResult = false;

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
    res.redirect('/')
  } else {  //sinon 
    res.redirect('/')
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

// Logout
router.get('/logout', async (req, res, next) => {
  req.session.user = null;
  res.redirect('/');
});

module.exports = router;
