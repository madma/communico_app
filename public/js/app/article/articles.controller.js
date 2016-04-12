(function() {
  "use strict";

  angular
    .module("app")
    .controller("ArticlesController", ArticlesController);

  ArticlesController.$inject = ["$log", "authService", "userService", "$state", "$http", "$uibModal", "$scope"];

  function ArticlesController($log, authService, userService, $state, $http, $uibModal, $scope) {
    var vm = this;

    // BINDINGS
    vm.userLink = "";
    vm.submitLink = submitLink;
    vm.articles = [];

    vm.getArticles = getArticles;
    vm.getArticles();

    vm.show = false;

    vm.animationsEnabled = true;

    // FUNCTIONS
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
        getArticles();
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
        }
      });
    };

    $log.debug("ArticlesController loaded!");
  }
})();
