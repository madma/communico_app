var selection;

(function() {
  "use strict";

  angular
    .module("app")
    .factory("articlesModalService", articlesModalService);

  articlesModalService.$inject = ["$log", "$uibModal", "$window", "$document"];

  function articlesModalService($log, $uibModal, $window, $document) {
    $log.debug("articlesModalService loaded!");

    // BINDINGS
    var service = {
      open: open,
      logSelectedText: logSelectedText
    };

    return service;

    // FUNCTIONS
    function open(article) {}

    function logSelectedText() {
      var text = "";
      // var selection = null;
      if ($window.getSelection) {
          text = $window.getSelection().toString();
          selection = $window.getSelection();
      } else if ($document.selection && $document.selection.type != "Control") {
          text = $document.selection.createRange().text;
      }
      $log.info("The selected text is: ", "\n", text);
      $log.info("The selection is: ", "\n", selection);
      return text;
    }


  }
})();
