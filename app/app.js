(function () {
    'use strict';

    angular.module('app', [
        'app.templates',
        'app.fieldGrid',
        'app.playerInfo'
    ]).controller('appController', AppController);

    function AppController($rootScope, $scope) {
        $scope.generateField = function(rows, cols) {
            var field = [];
            for (var i = 0; i < rows; i++) {
                field[i] = [];
                for (var j = 0; j < cols; j++) {
                    field[i][j] = 0;
                }
            }
            $scope.field = field;
        }
        $scope.generateField(3, 3);

        $scope.player = {
            1: {
                name: 'A.I.',
                score: 0,
                isHuman: false
            },
            2: {
                name: 'Player',
                score: 0,
                isHuman: true
            }
        };

        $rootScope.$on('onStateChange', function(ev, obj) {
            $scope.field[obj.row][obj.col] = obj.state;
            $scope.matchWinner = calculateMatch($scope.field);
            console.debug($scope.field);
        });

        function calculateMatch(field) {
            for (var row = 0; row < field.length; row++) {
                for (var col = 0; col < field[row].length; col++) {
                    if ((field[row][col] === field[row + 1][col] &&
                         field[row][col] === field[row + 2][col]) ||
                        (field[row][col] === field[row][col + 1] &&
                         field[row][col] === field[row][col + 2]) ||
                        (field[row][col] === field[row + 1][col + 1] &&
                         field[row][col] === field[row + 2][col + 2])) {
                        return field[row][col];
                    }
                }
            }
        }
    }
}());
