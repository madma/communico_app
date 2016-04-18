(function() {
  "use strict";

  angular
    .module("app")
    .controller("ArticlesController", ArticlesController);

  ArticlesController.$inject = ["$log", "authService", "userService", "articlesModalService", "$state", "$http", "$uibModal", "$scope"];

  function ArticlesController($log, authService, userService, articlesModalService, $state, $http, $uibModal, $scope) {
    var vm = this;

    // BINDINGS
    vm.userLink = "";
    vm.submitLink = submitLink;
    vm.articles = [];
    vm.myArticles = true;
    vm.allArticles = !vm.myArticles;
    vm.show = false;
    vm.animationsEnabled = true;

    vm.getArticles = getArticles;
    vm.getMyArticles = getMyArticles;
    vm.isInMyArticles = isInMyArticles;
    vm.addArticle = addArticle;


    // vm.logSelectedText = articlesModalService.logSelectedText;

    // FUNCTIONS
    vm.getMyArticles();

    function getArticles() {
      $http({
        method: "GET",
        url: "/api/articles",
      })
      .then(function(res) {
        $log.debug("THE GET ARTICLES RESPONSE IS THIS: ", res);
        vm.articles = res.data;
      })
      .catch(function(err) {
        $log.debug(err);
      });
    }


    function isInMyArticles(article) {
      if (article.addedBy.indexOf(authService.currentUser()._id) !== -1) return true;
      return false;
    }

    function addArticle(article) {
      $http({
        method: "PUT",
        url: "/api/users/me/articles",
        data: {articleId: article._id, userId: authService.currentUser()._id}
      })
      .then(function(res) {
        $log.debug("THE PUT ARTICLES RESPONSE IS THIS: ", res);
        vm.myArticles = true;
        vm.articles = res.data;
      })
      .catch(function(err) {
        $log.debug(err);
      });
    }

    function getMyArticles() {
      $http({
        method: "GET",
        url: "/api/users/me/articles",
      })
      .then(function(res) {
        $log.debug("THE GET ARTICLES RESPONSE IS THIS: ", res);
        vm.articles = res.data;
      })
      .catch(function(err) {
        $log.debug(err);
      });
    }

    function submitLink() {
      $http({
        method: "POST",
        url: "/api/articles",
        data: {articleUrl: vm.userLink, userId: authService.currentUser()._id}
      })
      .then(function(res) {
        $log.debug("THE RESPONSE IS THIS: ", res);
      })
      .then(function() {
        getMyArticles();
      })
      .catch(function(err) {
        $log.debug('Error:', err);
      });
    }

    vm.open = function (article) {
      $uibModal.open({
        animation: vm.animationsEnabled,
        scope: $scope,
        templateUrl: 'myModalContent.html',
        resolve: {article: article},
        controller: function(article, $scope) {
          $scope.article = article;
          $scope.logSelectedText = articlesModalService.logSelectedText;
        }
      });
    };

    $log.debug("ArticlesController loaded!");
  }
})();
