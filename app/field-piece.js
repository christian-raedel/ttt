(function () {
  'use strict';

  angular.module('app.fieldPiece', [])
  .directive('fieldPiece', FieldPiece);

  function FieldPiece() {
    return {
      restrict: 'E',
      templateUrl: 'field-piece.tpl.html',
      scope: {
        state: '='
      },
      link: linkFn
    }

    function linkFn(scope, elem, attrs) {
    }
  }
}());
