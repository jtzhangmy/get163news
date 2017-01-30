var mongoose = require('mongoose');
var db = require('./database');

var Schema = mongoose.Schema;

var listSchema = new Schema({
  id: String,
  title: String,
  keywords: [],
  time: String,
  channelName: String,
  image: String
});

var NewsList = mongoose.model("NewsList", listSchema);

module.exports = NewsList;



















