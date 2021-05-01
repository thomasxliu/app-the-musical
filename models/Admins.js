const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const adminSchema = new mongoose.Schema({
  // To be discussed latter
  UserId: { type: String, index: { unique: true } },
});


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
