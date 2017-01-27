var getDate = require('./date')
   ,fs = require('fs');

function createFile() {
  var imgFile = `images/${getDate}`;
  fs.exists(imgFile, function(exists) {
    if (exists) {
      console.log('存在');
    } else {
      console.log('不存在');
      fs.mkdir(imgFile, function (err) {
        if (err) {
          console.log('创建目录失败');
        } else {
          console.log('创建目录成功');
        }
      })
    }
  });
}

module.exports = createFile();