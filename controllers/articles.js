// Require resource's model(s).
var Article = require("../models/Article");
var scraper = require("../spike_code/request_cheerio_scraper.js");

var index = function(req, res, next) {
  Article.find({}, function(err, Articles) {
    if (err) {
      res.json({message: err});
    } else {
      res.render('Articles/index', {Articles: Articles});
    }
  });
};

var show = function(req, res, next) {
  Article.findById(req.params.id, function(err, Article) {
    if (err) {
      res.json({message: 'Could not find Article because ' + err});
    } else if (!Article) {
      res.json({message: 'No Article with this id.'});
    } else {
      res.render('Articles/show', {Article: Article});
    }
  });
};

var scrape = function(req, res, next) {
  console.log("REQ IS: ", req.body);
  var options = new scraper.Options(req.body.articleUrl);
  console.log(options);
  console.log("SCRAPING.................");
  scraper
    .getDescription(options)
    .then(function(description) {
      res.json({description: description});
    })
    .catch(function(err) {
      next(err);
    });
};

module.exports = {
  // create: create,
  index: index,
  show:  show,
  // update: update,
  scrape: scrape
};
