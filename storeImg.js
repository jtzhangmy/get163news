var date = require('./date')
   ,uuid = require('node-uuid')
   ,fs = require('fs')
   ,request = require('request');

function storeImg(src) {
  var imgName = uuid.v1().replace(/\-/g,'') + '.png';
  var storeSrc = `images/${date}/${imgName}`;
  try {
    request(src)
      .pipe(fs.createWriteStream(storeSrc))
      .on('close', function (err) {
        if(err) {
          console.log('--保存失败!--')
        } else {
          console.log('--保存完成!--');
        }
      });
  } catch (err) {
    console.log('爬取错误')
  }
  return storeSrc;
}

module.exports = storeImg;