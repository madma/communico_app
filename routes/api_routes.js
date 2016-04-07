var express = require("express"),
    router  = new express.Router();

// Require controllers
var usersController = require("../controllers/users");
// var articlesController = require("../controllers/articles");
var articlesUsersController = require("../controllers/articlesUsers");

// Require token authentication
var token = require("../config/token_auth");

// user resource paths:
router.post('/users',    usersController.create);
router.get( '/users/me', token.authenticate, usersController.me);
router.put( '/users/me', token.authenticate, usersController.update);

router.post('/token', token.create);
router.post('/users/me/token', token.authenticate, token.refresh);


// article resource paths
router.post("/articles", token.authenticate, articlesUsersController.scrape);

module.exports = router;
