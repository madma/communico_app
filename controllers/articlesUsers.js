var util = require('util');

// Require resource's model(s).
var User = require('./../models/user');
var Article = require('./../models/article');
var scraper = require("./helpers/articles.scraper.js");

var user;


function create(req, res, next) {
  if (!req.body.articleUrl) return res.status(422).send("Missing required fields");

  var articleUrl,
      returnedArticle;

  // console.log("Current user:", req.user);
  scraper
    .getCanonicalUrl(req.body.articleUrl)
    .then(function(canonicalUrl) {
      articleUrl = canonicalUrl;
      console.log("THE CANONICAL LINK IS: ", articleUrl);
      return Article.findOne().where("url", canonicalUrl).exec();
    })
    .then(function(foundArticle) {
      if (foundArticle) {
        console.log("ARTICLE FOUND:", foundArticle.title, "etc.…");
        foundArticle.addedBy.push(req.user._id);
        return foundArticle.save();
      } else {
        console.log("ARTICLE NOT FOUND, ADDING TO DB!");
        return scraper
          .scrapeArticle(articleUrl)
          .then(function(articleData) {
            console.log("SCRAPED DATA:", articleData.title, "etc.…");
            articleData.addedBy = [req.user._id];
            return Article.create(articleData);
          })
          .catch(function(err) {
            console.log("SCRAPER ERR", err)
          });
      }
    })
    .then(function(article) {
      console.log("EMBEDDING ARTICLE REF IN USER");
      returnedArticle = article;
      req.user.articles.push({
        article:      article._id,
        title:        article.title,
        description:  article.description,
        thumbnailImg: article.thumbnailImg,
        subjects:     article.subjects
      });
      return req.user.save();
    })
    .then(function(user) {
      res.status(201).json({user: user, article: returnedArticle});
    })
    .catch(function(err) {
      next(err);
    });
}

function index(req, res, next) {
  Article
    .find({"addedBy": req.user._id}).exec()
    .then(function(articles) {
      console.log("FOUND THE FOLLOWING ARTICLES FOR THE USER: ", req.user.email);
      articles.forEach(article => console.log(article.title));
      res.status(200).json(articles);
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

function update(req, res, next) {
  console.log("PUT request received with this data: ", "\n", req.body, req.user._id);
  Article.findByIdAndUpdate(req.body.articleId, {$push: {addedBy: req.user._id}}, {new: true}).exec()
    .then(function(article) {
      console.log("UPDATED ARTICLE is: ", "\n", article);
      return User.findByIdAndUpdate(req.user._id, {$push: {articles: article}}, {new: true}).exec();
    })
    .then(function(user) {
      console.log("UPDATED USER is: ", "\n", user);
      console.log("UPDATED THE ARTICLE AND USER");
      index(req, res, next);
    });
}


module.exports = {
  scrape: create,
  index: index,
  // show:  show,
  update: update,
};
