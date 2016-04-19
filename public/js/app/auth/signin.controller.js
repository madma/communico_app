(function() {
  "use strict";

  angular
    .module("app")
    .controller("SignInController", SignInController);

  SignInController.$inject = ["$log", "authService", "userService", "$state"];

  function SignInController($log, authService, userService, $state) {
    var vm = this;

    // BINDINGS
    vm.signUp = {
      firstName: "",
      lastName: "",
      username: "",
      email:    "",
      password: "",
      passwordConfirmation: ""
    };
    vm.submitSignUp = submitSignUp;
    vm.logIn = {
      email_username:    "",
      password: ""
    };
    vm.submitLogIn = submitLogIn;
    vm.conflict = false;
    vm.invalidLogin = false;

    // FUNCTIONS
    function submitSignUp() {
      userService
        .create(vm.signUp)
        .then(function(res) {
          $log.debug(res);
          return authService.logIn(vm.signUp);
        })
        .then(
          // on success
          function(decodedToken) {
            $log.debug('Logged in!', decodedToken);
            $log.debug('Token data: ', authService.currentUser());
            $state.go('articles');
          },
          // on error
          function(err) {
            if (err.status === 409) vm.conflict = true;
            $log.debug('Error:', err);
          }
        );
    }

    function submitLogIn() {
      authService
        .logIn(vm.logIn)
        .then(
          // on success
          function(decodedToken) {
            $log.debug('Logged in!', decodedToken);
            $log.debug('Token data: ', authService.currentUser());
            $state.go('articles');
          },
          // on error
          function(err) {
            if (err.status === 403) vm.invalidLogin = true;
            $log.debug('Error:', err);
          }
        );
    }

    $log.debug("SignInController loaded!");
  }
})();
