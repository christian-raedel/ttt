(function () {
    'use strict';

    angular.module('app', [
        'app.templates',
        'app.fieldGrid',
        'app.WampService'
    ]).controller('appController', AppController);

    function AppController($rootScope, $scope, WampService) {
        function onSubscriptionEvent(args) {
            $scope.matchlist = args[0];
            /*
            if ($scope.matchlist.hasProperty($scope.matchname)) {
                $rootScope.match = $scope.matchlist[$scope.matchname];
            } else {
                Object.keys($scope.matchlist).forEach(function(match) {
                    if (match.player1 === $scope.playername || match.player2 === $scope.playername) {
                        $rootScope.match = match;
                    }
                });
            }
            */
        }

        $scope.init = function() {
            WampService.subscribe(onSubscriptionEvent)
            .then(function(subscription) {
                $scope.subscription = subscription;
            }, function(err) {
                console.error(err);
            });

            $scope.matchlist = {};
            $rootScope.match = {};
        };
        $scope.init();

        $scope.createGame = function(playername, matchname) {
            WampService.call('add2', [playername, matchname])
            .then(function(args) {
                $scope.matchlist = args[0];
                $rootScope.match = $scope.matchlist[matchname];
            }, function(err) {
                throw err;
            });
        };

        $scope.joinGame = function(playername) {
            WampService.call('find2', [playername])
            .then(function(args) {
                $scope.matchlist = args[0];
                Object.keys($scope.matchlist).forEach(function(matchname) {
                    if ($scope.matchlist[matchname].player2 === playername) {
                        $rootScope.match = $scope.matchlist[matchname];
                        $scope.matchname = matchname;
                    }
                });
            }, function(err) {
                throw err;
            });
        };

        $scope.$watch('matchname', function(newValue, oldValue) {
            if (newValue !== oldValue && $scope.matchlist.hasOwnProperty(newValue)) {
                $rootScope.match = $scope.matchlist[newValue];
            }
        });

        $rootScope.$watch('match', function(newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.match = newValue;
            }
        }, true);

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
