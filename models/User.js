const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
  // To be discussed latter
  UserId: { type: String, index: { unique: true } },
  UserName: String,
  Email: String,
  IsAdmin: Boolean,
  Score: Number
});


const User = mongoose.model('User', userSchema);

module.exports = User;
