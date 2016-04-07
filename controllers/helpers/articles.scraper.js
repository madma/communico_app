var request = require("request-promise");
var cheerio = require("cheerio");
var read = require("node-read");
var unfluff = require("unfluff");
var util = require('util');
var fs = require('fs');
var path = require("path");


var str = "./../../spike_code/nytimes_test.html";

// "~/code/wdi/project04/communico_app/spike_code/nytimes_test.html"

// var url = path.parse(str);

var url = "http://localhost:8000/public/nytimes_test.html";

// Standard fields
var scrapeFieldsSelectors = {
  title: ["[property='og:title']", "content"],
  // author: ,
  description: ["[property='og:description']", "content"],
  // publisher: ,
  url: ["[rel='canonical']", "href"],
  // text: ,
  // images: ,
  thumbnailImg: ["[property='og:image']", "content"],
  // publishedOn: ,
  subjects: ["[name='keywords']", "content"],
};

// Non-standard fields: node-read
var readFields = [
  "text"
];

// Non-standard fields: unfluff
var unfluffFields = [
  "author",
  "publisher",
  "publishedOn"
];


function Options(uri) {
  this.uri = uri;
  this.jar = true;
}

Options.prototype.transform = body => cheerio.load(body);

function scrapeArticle(url) {
  var opt = new Options(url);
  var article = {};

  request(opt)
    .then(function($) {
      var keys = Object.keys(scrapeFieldsSelectors);
      keys.forEach(key => article[key] = $(scrapeFieldsSelectors[key][0]).attr(scrapeFieldsSelectors[key][1]));
      article.subjects = article.subjects.toLowerCase().split(",");
      // console.log($);
      // var html =
      return [$, $.html()];
    })
    .then(function(data) {
      read(data[1], function(err, doc, res) {

        // article.text = cheerio.load(doc.content)('div').contents();
        data[0](doc.content).find('p').each((i, e) => console.log(`<p>${data[0](e).html()}</p>\n`));
        // article.text = data[0](doc.content).each((i, e) => console.log(data[0](e).text()));
        // console.log(util.inspect(article.text['34'], false, null));
        // console.log(article.text);
        // console.log("************");
        // console.log(unfluff($));
        return article;
      });
    });
}

scrapeArticle("http://www.nytimes.com/2016/04/10/magazine/the-new-europeans.html");

// read("http://www.nytimes.com/2016/04/10/magazine/the-new-europeans.html", (err, doc, res) => console.log(doc.content));

module.exports = {
  scrapeArticle: scrapeArticle,
};
