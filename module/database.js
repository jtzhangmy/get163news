var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/163news');

var db = mongoose.connection;

if(db){
  console.log('---链接成功---');
}

module.exports = db;