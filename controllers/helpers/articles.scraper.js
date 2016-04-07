var request = require("request-promise");
var cheerio = require("cheerio");
var read = require("node-read");

function Article() {
  this.title = null;
  this.author = null;
  this.description = null;
  this.publisher = null;
  this.url = null;
  this.text = null;
  this.images = null;
  this.thumbnailImg = null;
  this.publishedOn = null;
  this.subjects = null;
}

// Standard fields
var scrapeFieldsSelectors = {
  title: ["[property='og:title']", "content"],
  description: ["[property='og:description']", "content"],
  url: ["[rel='canonical']", "href"],
  thumbnailImg: ["[property='og:image']", "content"],
  subjects: ["[name='keywords']", "content"],
};

// Non-standard fields for node-read
var readFields = [
  "text"
];


function Options(uri) {
  this.uri = uri;
  this.jar = true;
}

Options.prototype.transform = body => cheerio.load(body);

function scrapeArticle(url) {
  var opt = new Options(url);
  var article = new Article();

  request(opt)
    .then(function($) {
      var keys = Object.keys(scrapeFieldsSelectors);
      keys.forEach(key => article[key] = $(scrapeFieldsSelectors[key][0]).attr(scrapeFieldsSelectors[key][1]));
      article.subjects = article.subjects.toLowerCase().split(",");
      return $.html();
    })
    .then(function(html) {
      read(html, function(err, doc, res) {
        article.publisher = getHostname(article.url);
        article.text = "";
        var d = doc.content.toString();
        var $ = cheerio.load(d);
        $('p').each((i, e) => article.text += `<p>${$(e).html()}</p>`);
        console.log(article);
        return article;
      });
    });
}

function getHostname(url) {
    var h = url.match(/^http:\/\/[^/]+/);
    return h ? h[0] : null;
}


module.exports = {
  scrapeArticle: scrapeArticle,
};
