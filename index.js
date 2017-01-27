var http = require('http')
  ,cheerio = require('cheerio')
  ,iconv = require('iconv-lite')
  ,fs = require('fs')
  ,color = require('colors')
  ,getDetailData = require('./get-detail')
  ,storeImg = require('./storeImg')
  ,createFile = require('./createFile');

getListData('http://temp.163.com/special/00804KVA/cm_yaowen.js');

function getListData(url) {
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
      html = JSON.parse(filter(trim(html)));
      console.log(html);
      var num = 0;
      var dataLen = html.length;
      var timer = setInterval(function () {
        if(num < dataLen) {
          var detailUrl = html[num].docurl;
          getDetailData(detailUrl);
          console.log(num);
          num ++;
        } else {
          console.log('爬取完毕');
          clearInterval(timer);
        }
      }, 1000)

    })
  })
};

function trim(str) {
  var resultStr = str.replace(/[ ]/g, "").replace(/\n/g, "").replace(/\r/g, "");
  return resultStr;
}

function filter(str) {
  var filterData = str.replace('data_callback\(', '').replace(/\)/g, '');
  return filterData;
}