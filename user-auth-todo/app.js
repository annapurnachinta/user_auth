const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();

// Configure session
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Connect to MongoDB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true}).then(() => {
  console.log("DB CONNECTED")
}).catch((e) => {
  console.log(e, "UNABLE to connect to DB")
})

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Use the user and task routes
app.use('/', users);
app.use('/tasks', tasks);

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});