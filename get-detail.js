var http = require('http')
  , cheerio = require('cheerio')
  , iconv = require('iconv-lite')
  , color = require('colors')
  , storeImg = require('./storeImg')
  , NewsDetail = require('./module/newsDetail');

// var url = 'http://news.163.com/17/0126/08/CBMOHKMF0001875P.html';
// getDetailData('http://news.163.com/17/0126/08/CBMOHKMF0001875P.html')

module.exports = function(url, id) {
  console.log(url.green);

  http.get(url, function (res) {
    var bufArr = [];
    var bufLen = 0;
    res.on('data', function (chunk) {
      bufArr.push(chunk);
      bufLen += chunk.length;
    });

    res.on('end', function () {
      var chunkAll = Buffer.concat(bufArr, bufLen);
      var html = iconv.decode(chunkAll, 'gb2312');
      var $ = cheerio.load(html);
      var title = $('#epContentLeft h1').text();
      var dateTime = trim($('.post_time_source').text().replace('来源:', ''));
      var from = $('#ne_article_source').text();
      var text = $('#endText p');
      var content = [];
      for (var  i = 0, j = text.length; i < j; i++) {
        var section = trim(text.eq(i).html());
        if(section) {
          if(isImg(section)) {
            var imgSrc = getImgSrc(section);
            var newSrc = storeImg(imgSrc);
            section = replaceImgSrc(section, newSrc);
            section = filterIdStyle(section);
            content.push(section);
          } else {
            content.push(section);
          }
        }
      }
      
      var _newsDetail = NewsDetail({
        id: id,
        title: title,
        time: dateTime,
        from: from,
        content: content
      });

      _newsDetail.save(function (err) {
        if (err) {
          console.log('详情存储失败'.red);
        } else {
          console.log('详情存储成功'.yellow)
        }
      });

      console.log(content);
      console.log('----------'.red);
    })
  }).on('error', function () {
    console.log('error');
  })
};

function trim(testStr) {
  var resultStr = testStr.replace(/[\s\s]/g, "").replace(/[\t\n]/g, "");
  return resultStr;
}

function isImg(str) {
  var imgReg = new RegExp(/<img\b[^>]*>/);
  return imgReg.test(str);
}

function getImgSrc(str) {
  var srcReg = /src=\"([^\"]*?)\"/gi;
  var imgSrc = str.match(srcReg);
  imgSrc = imgSrc.toString();
  imgSrc = imgSrc.replace(/src="/g, '').replace(/"/g, '')
  return imgSrc;
}

function filterIdStyle(str) {
  var filterStr = str
    .replace(/id=\"([^\"]*?)\"/gi, '')
    .replace(/style=\"([^\"]*?)\"/gi, '');
  return filterStr;
}

function replaceImgSrc(section, newSrc) {
  return section.replace(/src=\"([^\"]*?)\"/gi, `src="${newSrc}"`);
}


