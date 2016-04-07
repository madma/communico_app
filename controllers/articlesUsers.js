var util = require('util');

// Require resource's model(s).
var User = require('./../models/user');
var Article = require('./../models/article');
var scraper = require("./helpers/articles.scraper.js");

var user;


function create(req, res, next) {
  if (!req.body.articleUrl) return res.status(422).send("Missing required fields");

  var articleUrl;

  console.log("Current user:", req.user);
  scraper
    .getCanonicalUrl(req.body.articleUrl)
    .then(function(canonicalUrl) {
      articleUrl = canonicalUrl;
      console.log("THE CANONICAL LINK IS: ", articleUrl);
      return Article.findOne().where("url", canonicalUrl).exec();
    })
    .then(function(foundArticle) {
      if (foundArticle) {
        console.log("ARTICLE FOUND:", foundArticle.addedBy);
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
          });
      }
    })
    .then(function(article) {
      console.log("ARTICLE (NOW) IN DB:", article);
      res.sendStatus(200);
    });

  // User
  //   .findById(req.body.userId).exec()
  //   .then(function(userDoc) {
  //     user = userDoc;
  //   })
  //   .then(function() {
  //     return scraper.getCanonicalUrl(req.body.articleUrl);
  //   })
  //   .then(function(canonicalUrl) {
  //       articleUrl = canonicalUrl;
  //       console.log("THE CANONICAL LINK IS: ", articleUrl);
  //       return Article.find().where("url", canonicalUrl).exec();
  //   })
  //   .then(function(foundArticle) {
  //     article.addedBy.push(user._id);
  //     res.status(409).send("Article already exists; Proceeding to add for the current user...");
  //     return article.save();
  //   }, function(err) {
  //       scraper
  //         .scrapeArticle(articleUrl)
  //         .then(function(articleData) {
  //           res.status(200).send("Article does not exist; Proceeding to create it in the database...");
  //           articleData.addedBy = [];
  //           articleData.addedBy.push(user._id);
  //           return Article.create(articleData);
  //         });
  //   })
  //   .then(function(updatedArticle) {
  //     user.articles.push({
  //       article:      updatedArticle._id,
  //       title:        updatedArticle.title,
  //       description:  updatedArticle.description,
  //       thumbnailImg: updatedArticle.thumbnailImg,
  //       subjects:     updatedArticle.subjects
  //     });
  //     return user.save();
  //   })
  //   .then(function(updatedUser) {
  //     res.status(200).send("Updated the submitted article and added it to the current user's articles");
  //     console.log(util.inspect(updatedUser, false, null));
  //   })
  //   .catch(function(err) {
  //     err.status = 422;
  //     return res.status(422).send("Error handling article form data.");
  //     next(err);
  //   });
}


module.exports = {
  scrape: create,
  // index: index,
  // show:  show,
  // update: update,
};
