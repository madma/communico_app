(function() {
  "use strict";

  angular
    .module("app")
    .controller("ArticlesController", ArticlesController);

  ArticlesController.$inject = ["$log", "authService", "userService", "$state", "$http"];

  function ArticlesController($log, authService, userService, $state, $http) {
    var vm = this;

    // BINDINGS
    vm.userLink = "";
    vm.submitLink = submitLink;

    // FUNCTIONS
    function submitLink() {
      $http({
        method: "POST",
        url: "/api/articles",
        data: {articleUrl: vm.userLink, userId: authService.currentUser()._id}
      })
      .then(function(res) {
        $log.debug("THE RESPONSE IS THIS: ", res);
      }, function(err) {
        $log.debug('Error:', err);
      });
    }

    $log.debug("ArticlesController loaded!");
  }
})();
