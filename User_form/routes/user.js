const express = require("express")
const User = require('../models/user');
const router = express.Router()
const path = require('path')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
const { validationResult } = require('express-validator')
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../') + '/template/register.html');
});

router.post('/register', (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(500).send('Error saving user');
        }
        req.session.userId = user._id;
        res.redirect('/login');
    });
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../') + '/template/login.html');
});

router.post('/login', (req, res) => {
    const { email, password } = req.body

    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(500).send('Error finding user');
        }
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Authenticate user
        if (!user.authenticate(password)) {
            return res.status(401).send('Invalid password');
        }

        // Create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET)

        // Put token in cookie
        res.cookie('token', token, { expire: new Date() + 1 })

        // Send response
        const {_id, name, email} = user
        return res.redirect('/home');
    });
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../') + '/template/home.html');
});

router.get('/home', (req, res) => {
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


module.exports = router