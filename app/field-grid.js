(function () {
  'use strict';

  angular.module('app.fieldGrid', [])
  .directive('fieldGrid', FieldGrid);

  function FieldGrid() {
    return {
      restrict: 'E',
      templateUrl: 'field-grid.tpl.html',
      scope: {
        state: '='
      },
      link: linkFn
    }

    function linkFn(scope, elem, attrs) {
    }
  }
}());
