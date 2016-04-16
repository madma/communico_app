var mongoose = require("mongoose"),
    debug    = require("debug")("app:models");


var userArticleSchema = new mongoose.Schema({
  article:     {type: mongoose.Schema.Types.ObjectId, ref: "Article"},
  title:        String,
  description:  String,
  thumbnailImg: String,
  subjects: [String],
  tags:         [String],
  text: String
});

userArticleSchema.methods.addTag = function(newTag) {
  newTag = newTag.toLowerCase();
  if (this.tags.indexOf(newTag) === -1) {
    this.tags.push(newTag);
    return newTag;
  } else {
    return null;
  }
};

// var user    = User.findById(...);
// var article = Article.findById(...);
// var usersArticle = user.articles.push({
//   article:      article._id,
//   title:        article.title,
//   description:  article.description,
//   thumbnailImg: article.thumbnailImg,
//   tags:         ['puglife', 'yolo']
// });
// possibly:
// var usersArticle = user.articles[user.articles.length-1];
// user.save();

// How you add tags by default.
// usersArticle.tags.push('lavidaloca');
// user.save();

// How you do it now.
// usersArticle.addTag('newTag');
// user.save();
// if (!usersArticle.addTag('newTag')) {
//   res.send('Tag already added!');
// }

var userSchema = new mongoose.Schema({
  firstName: {type: String, required: true, unique: false},
  lastName:  {type: String, required: true, unique: false},
  username:  {type: String, required: true, unique: true},
  email:     {type: String, required: true, unique: true},
  articles:  [userArticleSchema]
});

// Add bcrypt hashing to model (works on a password field)!
userSchema.plugin(require("mongoose-bcrypt"));

// Add a "transformation" to the model's toJson function that
// stops the password field (even in digest format) from being
// returned in any response.
userSchema.options.toJSON = {
  transform: function(document, returnedObject, options) {
    delete returnedObject.password;
    return returnedObject;
  }
};

var User = mongoose.model("User", userSchema);

module.exports = User;
