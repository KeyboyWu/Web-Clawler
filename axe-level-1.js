var request = require("request");
var cheerio = require("cheerio");

// 三年甲班成績單
var url = "http://axe-level-1.herokuapp.com/"

// 取得網頁資料
request(url, function (error, response, body) {
  if (!error) {

    // 用 cheerio 解析 html 資料
    var $ = cheerio.load(body);

    // 篩選有興趣的資料
    var tr = $('body > table >> tr');

    // 變數
    var output = [];  // 最後輸出結果
    var title = [];   // 儲存科目名稱

    for(var i=0; i<tr.length; i++) {
      var td = $(tr[i]).children();
      if (i == 0) {   // 取得科目名稱
        for(var j=1; j<td.length; j++) {
          title.push($(td[j]).text());
        }
      } else {        // 取得姓名及成績
        var obj={"name":"","grades":{}};
        for(var j=0; j<td.length; j++) {
          switch(j) {
          case 0:
            obj["name"]=$(td[j]).text();
            break;
          default:
            obj["grades"][title[j-1]]=parseInt($(td[j]).text()); // 分數需轉換為數字
          }
        }
        output.push(obj);
      }
    }
    // 輸出
    console.log(JSON.stringify(output));
  } else {
    console.log("擷取錯誤：" + error);
  }
});
