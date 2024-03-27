const express = require("express")
const { register, login, logout } = require("../controllers/user")
const {check} = require('express-validator')
const router = express.Router()

router.post('/register', [
  check("name", "Name atleast should be 3 characters").isLength({min: 3}),
  check("email", "Email should be valid").isEmail(),
  check("password", "Password at least should be 6 characters").isLength({min: 6}),
] ,register)

router.post('/login', login)

router.get("/logout", logout)

module.exports = router