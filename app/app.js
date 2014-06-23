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

        $rootScope.field = $scope.field;

        $scope.player = {
            1: {
                name: 'A.I.',
                score: 0,
                isHuman: false,
                isMatchBeginner: false,
                isMatchWinner: false
            },
            2: {
                name: 'Player',
                score: 0,
                isHuman: true,
                isMatchBeginner: false,
                isMatchWinner: false
            }
        };

        $scope.setMatchWinner = function(key, isMatchWinner) {
            $scope.player[key].isMatchWinner = isMatchWinner;
        };

        $scope.setMatchBeginner = function() {
            var beginner = Math.floor((Math.random() * Object.keys($scope.player).length) + 1);
            Object.keys($scope.player).forEach(function(key) {
                $scope.player[key].isMatchBeginner = false;
            });
            $scope.player[beginner].isMatchBeginner = true;
            if (!$scope.player[beginner].isHuman) {
                var obj = findNextFreeField($scope.field);
                angular.extend(obj, {state: beginner});
                $scope.$emit('onStateChange', obj);
            }
            console.debug('matchBeginner', beginner);
        };

        $scope.resetField = function() {
            Object.keys($scope.player).forEach(function(key) {
                $scope.setMatchWinner(key, false);
            });
            $scope.generateField(3, 3);
            $scope.setMatchBeginner();
        };
        $scope.resetField();

        $rootScope.$watchCollection('field', function(newValue, oldValue) {
            if (newValue !== oldValue) {
                var matchWinner = calculateMatchWinner(newValue);
                if (matchWinner) {
                    Object.keys($scope.player).forEach(function(key) {
                        $scope.setMatchWinner(key, false);
                    });
                    $scope.setMatchWinner(matchWinner, true);
                }
            }
        });

        function calculateMatchWinner(field) {
            for (var row = 0; row < field.length; row++) {
                for (var col = 0; col < field[row].length; col++) {
                    if (field[row][col] > 0) {
                        if ((field[row][col] === field[row + 1][col] &&
                             field[row][col] === field[row + 2][col]) ||
                            (field[row][col] === field[row][col + 1] &&
                             field[row][col] === field[row][col + 2]) ||
                            (field[row][col] === field[row + 1][col + 1] &&
                             field[row][col] === field[row + 2][col + 2]) ||
                            (field[row][col] === field[row + 1][col - 1] &&
                             field[row][col] === field[row + 2][col - 2])) {
                            return field[row][col];
                        }
                    }
                }
            }
            return null;
        }
    }
}());
