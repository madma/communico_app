var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

var articleSchema = new mongoose.Schema({
  title: String,
  author: String,
  publisher: String,
  url: String,
  text: String,
  thumbnailImg: String
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
