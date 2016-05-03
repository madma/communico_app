(function() {
  "use strict";

  angular
    .module("app")
    .controller("NavbarController", NavbarController);

  NavbarController.$inject = ["$log", "authService", "$state", "$location", "$anchorScroll"];

  function NavbarController($log, authService, $state, $location, $anchorScroll) {
    var vm = this;

    vm.authService = authService;
    vm.logOut      = logOut;
    vm.goToDiv     = goToDiv;


    function goToDiv(id) {
      $location.hash(id);
      $anchorScroll();
    }

    // Why put the $state change here instead of in the
    // auth service? Because I only want the auth service to
    // do auth-y things! You certainly can put $state.go in
    // there, but I choose to keep the next steps (ie, business
    // logic) in the controller, and isolate the steps in the
    // services to their bare-minimum.
    function logOut() {
      authService.logOut();
      $state.go('welcome');
    }

    $log.debug("NavbarController loaded!");
  }
})();
