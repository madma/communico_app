(function() {
  "use strict";

  angular
    .module("app")
    .controller("SplashController", SplashController);

  SplashController.$inject = ["$log", "authService", "userService", "$state", "$timeout"];

  function SplashController($log, authService, userService, $state, $timeout) {
    var vm = this;

    $timeout(function() {
      $state.go("welcome");
    }, 3000);

    $log.debug("SplashController loaded!");
  }
})();
