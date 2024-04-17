const express = require('express');
const router = express.Router();
const { User } = require('../model/models');
const path = require('path')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')

// User Registration
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../') + '/template/register.html');
});

router.post('/register', async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save().then(() => {
    req.session.userId = user._id;
    res.redirect('/login');
  }).catch((err) => {
    res.status(500).send(err, 'Error saving user');
  })
});

// User Login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../') + '/template/login.html')
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body
  User.find({}).then((user)=>{
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Authenticate user
    // if (!user.authenticate(password)) {
    //   return res.status(401).send('Invalid password');
    // }

    // Create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET)

    // Put token in cookie
    res.cookie('token', token, { expire: new Date() + 1 })

    // Send response
    const { _id, name, email } = user
    return res.redirect('/tasks');
  })
  .catch((err) =>{
    if (err) {
      console.log(err);
      return res.status(500).send('Error finding user');
    }
  })
  // User.find({}, (err, user) => {
  //   if (err) {
  //     return res.status(500).send('Error finding user');
  //   }
  //   if (!user) {
  //     return res.status(404).send('User not found');
  //   }

  //   // Authenticate user
  //   if (!user.authenticate(password)) {
  //     return res.status(401).send('Invalid password');
  //   }

  //   // Create token
  //   const token = jwt.sign({ _id: user._id }, process.env.SECRET)

  //   // Put token in cookie
  //   res.cookie('token', token, { expire: new Date() + 1 })

  //   // Send response
  //   const { _id, name, email } = user
  //   return res.redirect('/home');
  // });
});

module.exports = router;