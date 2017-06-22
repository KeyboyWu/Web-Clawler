var request = require("request");
var cheerio = require("cheerio");

// 新竹市村里長名單
var url = "http://axe-level-1.herokuapp.com/lv2"

// 取得分頁資料
request(url, function (error, response, body) {
  if (!error) {

    // 變數
    var output = [];  // 最後輸出結果
    var title = [];   // 儲存標題
    var urls = [];    // 分頁連結路徑
    var wait = 0;  //
    // 用 cheerio 解析 html 資料
    var $ = cheerio.load(body);

    // 篩選有興趣的資料
    var ahref = $('a');

    for(var i=0; i<ahref.length;i++) {
      urls.push({'url':url+$(ahref[i]).attr('href')});
    }
    // 輸出
    //console.log(urls);
    wait = urls.length;
    // 取得網頁資料
    for (i in urls) {
      request(urls[i], function (error, response, body) {
        if (!error) {
          var $ = cheerio.load(body);
          var res = [];
          var tr = $('body > table >> tr');
          for(var i=0; i<tr.length; i++) {
            var td = $(tr[i]).children();
            if (i == 0) {   // 取得標題
              for(var j=1; j<td.length; j++) {
                title.push($(td[j]).text());
              }
            } else {        // 取得內容
              output.push({"town":$(td[0]).text(), "village":$(td[1]).text(), "name":$(td[2]).text()});
            }
          }
          // In asynchronous request, we must wait until all request is done.
          wait--;
          if (wait==0) {
            console.log(JSON.stringify(output));
          } else {
            console.log("It's crawling, wait for " + wait + " items.");
          }
        } else {
          wait--;
          console.log("擷取錯誤：" + error);
        }
      });
    }
  } else {
    console.log("擷取錯誤：" + error);
  }
});
