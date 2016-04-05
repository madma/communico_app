(function() {
  "use strict";

  angular
    .module("app")
    .controller("ArticlesController", ArticlesController);

  ArticlesController.$inject = ["$log", "authService", "userService", "$state"];

  function ArticlesController($log, authService, userService, $state) {
    var vm = this;

    // BINDINGS


    // FUNCTIONS


    $log.debug("ArticlesController loaded!");
  }
})();
