(function() {
  "use strict";

  angular
    .module("app")
    .controller("Controller", Controller);

    Controller.$inject = ["$log", "$http", "$resource"];

    function Controller($log, $http, $resource) {
      var vm = this;

      // BINDINGS
      vm.articleUrl = "";

      vm.submitLink = submitLink;

      // HELPERS
      function submitLink() {
        $log.info("Submitting the article link...");



      }


      // SETUP
      $log.info('controller.js loaded!');
    }

})();
