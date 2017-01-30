var mongoose = require('mongoose');
var db = require('./database');

var Schema = mongoose.Schema;

var detailSchema = new Schema({
  id: String,
  title: String,
  time: String,
  from: String,
  content: []
});

var NewsList = mongoose.model("NewsDetail", detailSchema);

module.exports = NewsList;



















