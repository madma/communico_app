var request = require("request-promise");
var cheerio = require("cheerio");
var read = require("node-read");

function ArticleData() {
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

function getCanonicalUrl(url) {
  var opt = new Options(url);
  var canonicalUrl = "";
  var promise = request(opt)
    .then(function($) {
      console.log("Getting canonical url from raw link...");
      canonicalUrl = $(scrapeFieldsSelectors.url[0]).attr(scrapeFieldsSelectors.url[1]);
      console.log(canonicalUrl);
      return canonicalUrl;
    });
  return promise;
}

function scrapeArticle(url) {
  var opt = new Options(url);
  var article = new ArticleData();
  var promise = request(opt)
    .then(function($) {
      var keys = Object.keys(scrapeFieldsSelectors);
      keys.forEach(key => article[key] = $(scrapeFieldsSelectors[key][0]).attr(scrapeFieldsSelectors[key][1]));
      article.subjects = article.subjects.toLowerCase().split(",");
      return $.html();
    })
    .then(function(html) {
      return new Promise(function(resolve, reject) {
        read(html, function(err, doc, res) {
          if (err) return reject(err);
          article.publisher = getHostname(article.url);
          article.text = "";
          var d = doc.content.toString();
          var $ = cheerio.load(d);
          $('p').each((i, e) => article.text += `<p>${$(e).html()}</p>`);
          console.log("  scraper scraped:", article.title);
          resolve(article);
        });
      });
    });
  return promise;
}

function getHostname(url) {
    var h = url.match(/^http:\/\/[^/]+/);
    return h ? h[0] : null;
}


module.exports = {
  scrapeArticle: scrapeArticle,
  getCanonicalUrl: getCanonicalUrl,
};


// tests
/*
var rawLink = "http://www.nytimes.com/2016/04/07/opinion/blaming-the-white-victim-class.html?action=click&pgtype=Homepage&clickSource=story-heading&module=opinion-c-col-left-region&region=opinion-c-col-left-region&WT.nav=opinion-c-col-left-region&mtrref=www.nytimes.com&gwh=563583E47ADD563A06C17EB2135584FB&gwt=pay&assetType=opinion";

getCanonicalUrl(rawLink);
*/
