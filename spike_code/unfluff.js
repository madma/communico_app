var unfluff = require('unfluff');
var rp = require("request-promise");

var url = "http://www.miamiherald.com/news/local/community/miami-dade/miami-gardens/article70115832.html";

rp(url)
  .then((data) => {
    console.log(unfluff(data).text);
  });



