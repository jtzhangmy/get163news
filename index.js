var http = require('http')
  ,cheerio = require('cheerio')
  ,iconv = require('iconv-lite')
  ,fs = require('fs')
  ,color = require('colors')
  ,uuid = require('node-uuid')
  ,getDetailData = require('./module/get-detail')
  ,storeImg = require('./module/storeImg')
  ,createFile = require('./module/createFile')
  ,NewsList = require('./module/newsList');

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
      // console.log(html);
      var timer = setInterval(function () {
        if(num < dataLen) {
          var content = html[num];
          var title = content.title
            , id = uuid.v4().replace(/\-/g,'')
            , detailUrl = content.docurl
            , time = content.time
            , channelname = content.channelname
            , image = content.imgurl
            , keywords = content.keywords
            , tag = [];

          keywords.map(function (item) {
            tag.push(item.keyname)
          });



          NewsList.findOne({title: title}, function (err, NewsListData) {
            if (err) {
              console.log('储存失败1'.red);
            }
            if (NewsListData == null) {
              var _newsList = new NewsList({
                id: id,
                title: title,
                keywords: tag,
                time: time,
                channelName: channelname,
                image: storeImg(image)
              });

              _newsList.save(function (err, newsList) {
                if(err) {
                  console.log('储存失败2'.red);
                } else {
                  console.log('储存成功'.green);
                }
              })
            } else {
              console.log('已存在'.red);
            }
          });

          getDetailData(detailUrl, id);
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
  var resultStr = str.replace(/\s\s/g, "").replace(/\n/g, "").replace(/\r/g, "");
  return resultStr;
}

function filter(str) {
  var filterData = str.replace('data_callback\(', '').replace(/\)/g, '');
  return filterData;
}