// Require resource's model(s).
var Article = require("../models/article");
var scraper = require("./helpers/articles.scraper.js");


function create(req, res, next) {
  if (!req.body.articleUrl) return res.status(422).send("Missing required fields");

  Article
  .create(req.body)
  .then(function(article) {
    res.json({
      success: true,
      message: "Successfully created article.",
      data: {
        url: article.url,
        id:    article._id,
      }
    });
  })
  .catch(function(err) {
    if (err.message.match(/E11000/)) {
      err.status = 409;
      return res.status(409).send("Article already exists.");
    } else {
      err.status = 422;
      return res.status(422).send("Error handling article form data.");
    }
    next(err);
  });
}

var index = function(req, res, next) {
  Article.find({}, function(err, Articles) {
    if (err) {
      res.json({message: err});
    } else {
      res.json(Articles);
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
  create: create,
  index: index,
  show:  show,
  // update: update,
  scrape: scrape
};
