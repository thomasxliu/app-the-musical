const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const musicSchema = new mongoose.Schema({
  // hard coded music genere
  SongId : {type: Number, index:{unique: true}},
  TrackName: String
});


const Musicals = mongoose.model('Musicals', musicSchema);

module.exports = Musicals;
