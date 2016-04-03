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
      vm.article = {
        articleUrl: vm.articleUrl
      };

      vm.submitLink = submitLink;

      // HELPERS
      function submitLink(data) {
        $log.info("Submitting the article link...");
        $log.info("DATA is: ", data);
        $http({
          method: "POST",
          url: "/api/articles",
          data: JSON.stringify(data),
          headers: {"Content-Type": "application/json"}
        })
        .then(function(res) {
          $log.info("RESPONSE IS: ", res.data);
        });


      }


      // SETUP
      $log.info('controller.js loaded!');
    }

})();
