(function() {
  "use strict";

  angular
    .module("app")
    .controller("SplashController", SplashController);

  SplashController.$inject = ["$log", "authService", "userService", "$state", "$timeout"];

  function SplashController($log, authService, userService, $state, $timeout) {
    var vm = this;
    vm.goToWelcome = goToWelcome;

    function goToWelcome () {
      $state.go("welcome");
    }

    // $timeout(function() {
    //   $state.go("welcome");
    // }, 5000);

    $log.debug("SplashController loaded!");
  }
})();
