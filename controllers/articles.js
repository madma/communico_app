// Require resource's model(s).
var Article = require("../models/Article");

var index = function(req, res, next){
  Article.find({}, function(err, Articles) {
    if (err) {
      res.json({message: err});
    } else {
      res.render('Articles/index', {Articles: Articles});
    }
  });
};

var show = function(req, res, next){
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

module.exports = {
  create: create,
  index: index,
  show:  show,
  update: update,
  delete: delete,
};
