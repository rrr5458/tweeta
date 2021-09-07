var express = require('express');
const bcrypt = require('bcrypt')
var router = express.Router();
const db = require('../models')

/* GET users listing. */
router.post('/register', function(req, res, next) {
  // take username, password
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      error: 'please include username and password'
    })
  }

  // check if username is taken
  db.User.findOne({ 
    where: {
      username: req.body.username
    }
  })
    .then((user) => {
      if (user) {
        res.status(400).json({
          error: 'username already in use'
        })
        return
      }

      // hash password
      bcrypt.hash(req.body.password, 10)
        .then((hash) => {
          // store in database
          db.User.create({
            username: req.body.username,
            password: hash
          })
            .then((user) => {
              // respond with success/error
              res.status(201).json({
                success: 'User created'
              })
            })
        })
    })
});

module.exports = router;
