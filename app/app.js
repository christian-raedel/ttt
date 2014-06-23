(function () {
  'use strict';

  angular.module('app', [
      'app.templates',
      'app.fieldGrid'
  ]).controller('appController', AppController);

  function AppController($rootScope, $scope) {
      function generateField(rows, cols) {
          var field = [];
          for (var i = 0; i < rows; i++) {
              field[i] = [];
              for (var j = 0; j < cols; j++) {
                  field[i][j] = 0;
              }
          }
          return field;
      }

      $scope.setField = function() {
          $scope.field = generateField(3, 3);
      }
      $scope.setField();
  }
}());
