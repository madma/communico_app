var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

// highlighted substring of the article text
var highlightSchema = new mongoose.Schema({
  startChar: Number,
  endChar: Number,
  createdAt: Date,
  text: String,
  addedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}


});

var articleSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  publisher: String,
  url: String,
  text: String,
  images: [String],
  thumbnailImg: String,
  publishedOn: Date,
  subjects: [String],
  highlights: [highlightSchema],
  addedBy: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
