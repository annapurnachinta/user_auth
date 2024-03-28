const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

mongoose.connect('mongodb://localhost/user-auth', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/template/register.html');
});

app.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(500).send('Error saving user');
    }
    req.session.userId = user._id;
    res.redirect('/login');
  });
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/template/login.html');
});

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(500).send('Error finding user');
    }
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.password === req.body.password) {
      req.session.userId = user._id;
      res.redirect('/home');
    } else {
      res.status(401).send('Invalid password');
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/template/home.html');
});

app.get('/home', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  return User.find({}).then((user) => {
    user.map((user) => {
      if (user._id == req.session.userId) {
        res.send(`Welcome ${user.name} to the home page <br><br><a href="/">Logout</a>`);
      }
    })
  })
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});