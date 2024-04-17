const mongoose = require('mongoose');
const crypto = require("crypto");
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 32,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    unique: true
  },
  encry_password: {
    type: String,
  },
  salt: String,
}, {timestamps: true})

userSchema.virtual("password")
  .set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.encry_password = this.securePassword(password)
  })
  .get(function() {
    return this._password
  })

userSchema.methods.authenticate = function(plainpassword){
    return this.securePassword(plainpassword) === this.encry_password
  }

  userSchema.methods.securePassword = function(plainpassword) {
    if(!plainpassword) return "";

    try {
      return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex")
    } catch (err) {
      ""
    }
  }

const User = mongoose.model("User", userSchema)

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = { User, Task };