var express = require('express'),
    router  = new express.Router();

// Require controllers.
var pagesController = require('../controllers/pages');
var usersController = require('../controllers/users');
var articlesController = require('../controllers/articles');

// root path:
router.get('/', pagesController.welcome);

// user resource paths:
router.get('/users',     usersController.index);
router.get('/users/:id', usersController.show);

// article resource paths
router.post('/articles', articlesController.scrape);

module.exports = router;
