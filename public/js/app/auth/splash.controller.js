(function() {
  "use strict";

  angular
    .module("app")
    .controller("SplashController", SplashController);

  SplashController.$inject = ["$log", "authService", "userService", "$state", "$timeout", "articlesModalService", "$http", "$uibModal", "$scope"];

  function SplashController($log, authService, userService, $state, $timeout, articlesModalService, $http, $uibModal, $scope) {
    var vm = this;
    vm.goToWelcome = goToWelcome;

    // BINDINGS
    vm.userLink = "";
    vm.submitLink = submitLink;
    vm.articles = [];
    vm.myArticles = true;
    vm.allArticles = !vm.myArticles;
    vm.show = false;
    vm.animationsEnabled = true;

    // FUNCTIONS

    function submitLink() {
      $http({
        method: "POST",
        url: "/api/articles/demo",
        data: {articleUrl: vm.userLink}
      })
      .then(function(res) {
        $log.debug("THE RESPONSE IS THIS: ", res);
        vm.articles.push(res.data.article);
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

    function goToWelcome () {
      $state.go("welcome");
    }

    // $timeout(function() {
    //   $state.go("welcome");
    // }, 5000);

    $log.debug("SplashController loaded!");
  }
})();
