var request = require("request-promise");
var cheerio = require("cheerio");
var read = require("node-reading-it");

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
  subjects: ["[name*='keywords']", "content"],
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
      return canonicalUrl ? canonicalUrl : url;
    });
  return promise;
}

function getCanonicalUrls(urlsArray) {
  var promisesArray = urlsArray.map(url => getCanonicalUrl(url));
  return Promise.all(promisesArray)
    .then(function(canonicalUrls) {
      console.log("canonical urls: ", canonicalUrls);
      return canonicalUrls;
    });
}

function scrapeArticle(url) {
  var opt = new Options(url);
  var article = new ArticleData();
  var promise = request(opt)
    .then(function($) {
      var keys = Object.keys(scrapeFieldsSelectors);
      keys.forEach(key => article[key] = $(scrapeFieldsSelectors[key][0]).attr(scrapeFieldsSelectors[key][1]));
      (article.subjects) ? article.subjects = article.subjects.toLowerCase().split(",") : article.subjects = [""];
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
          // console.log("SCRAPED ARTICLE DATA:", "\n", article);
          resolve(article);
        });
      });
    });
  return promise;
}

function scrapeArticles(urlsArray) {
  var promisesArray = urlsArray.map(url => scrapeArticle(url));
  return Promise.all(promisesArray)
    .then(function(articleDataObjsArray) {
      // console.log("articleDataObjsArray: ", articleDataObjsArray);
      return articleDataObjsArray;
    });
}

// function scrapeArticles(urlsArray) {
//   var articleDataObjsArray = new Array();
//   return new Promise(function(resolve, reject) {
//     articleDataObjsArray = urlsArray.map(function(url) {
//       scrapeArticle(url);
//     });
//     resolve(articleDataObjsArray);
//   });
// }

function getHostname(url) {
    var h = url.match(/^http:\/\/[^/]+/);
    return h ? h[0] : null;
}


module.exports = {
  id: module.id,
  scrapeArticle: scrapeArticle,
  getCanonicalUrl: getCanonicalUrl,
  getCanonicalUrls: getCanonicalUrls,
  scrapeArticles: scrapeArticles,
};


// getCanonicalUrl("http://blog.sandeepdinesh.com/2015/07/running-mean-web-application-in-docker.html");
// scrapeArticle("http://blog.sandeepdinesh.com/2015/07/running-mean-web-application-in-docker.html");

// use phantomjs, a headless browser, to load content then scrape; link below is a good test case
// getCanonicalUrl("http://thelab.bleacherreport.com/more-than-a-sneaker/");
// scrapeArticle("http://thelab.bleacherreport.com/more-than-a-sneaker/");

// console.log("************************");
// console.log("************************");

// getCanonicalUrl("http://www.newyorker.com/magazine/2016/04/18/considering-female-rule");
// scrapeArticle("http://www.nytimes.com/2016/04/16/world/americas/files-suggest-honduras-police-leaders-ordered-killing-of-antidrug-officials.html?hp&action=click&pgtype=Homepage&clickSource=story-heading&module=second-column-region&region=top-news&WT.nav=top-news&_r=0");

// var rawLinks = [
//     "http://nymag.com/thecut/2016/04/black-girls-rock-is-the-celebration-we-deserve.html",
//     "http://www.businessinsider.com/how-to-buy-class-mens-dress-shoes-2016-4",
//     "http://remezcla.com/culture/96-year-old-wwii-vet-oldest-usc-grad/",
//     "http://m.nydailynews.com/new-york/cruz-bronx-school-visit-canceled-students-plan-walkout-article-1.2590946?cid=bitly"
//   ];

// console.log("testing getCanonicalUrls function");
// getCanonicalUrls(rawLinks);
