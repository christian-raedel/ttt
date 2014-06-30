(function () {
    'use strict';

    angular.module('app', [
        'app.templates',
        'app.fieldGrid',
        'app.dialog',
        'app.WampService'
    ]).controller('appController', AppController);

    function AppController($rootScope, $scope, WampService) {
        function onSubscriptionEvent(args) {
            $scope.$apply(function() {
                $scope.matchlist = args[0];
                if ($scope.matchlist.hasOwnProperty($scope.input.matchname)) {
                    $scope.match = $scope.matchlist[$scope.input.matchname];
                } else {
                    Object.keys($scope.matchlist).forEach(function(matchname) {
                        if ($scope.matchlist[matchname].player1 === $scope.input.playername ||
                            $scope.matchlist[matchname].player2 === $scope.input.playername) {
                            $scope.match = $scope.matchlist[matchname];
                        }
                    });
                }
                $rootScope.$broadcast('onMatchUpdated', $scope.match, $scope.input.playername);
            });
            console.debug('matchlist received');
        }

        $scope.init = function() {
            WampService.then(function(session) {
                session.subscribe('ttt:matchlist', onSubscriptionEvent)
                .then(function(subscription) {
                    $scope.subscription = subscription;
                }, function(err) {
                    console.error('error while subscribing to matchlist', err);
                });
            });

            $scope.matchlist = {};
            $scope.match = {};
        };
        $scope.init();

        $scope.createGame = function(input) {
            $scope.input = input;
            WampService.then(function(session) {
                session.call('ttt:add2', [input.playername, input.matchname])
                .then(function() {
                    $scope.showCreateGame = false;
                })
                .catch(function(err) {
                    console.error('error while creating game', err);
                });
            });
        };

        $scope.joinGame = function(input) {
            $scope.input = input;
            WampService.then(function(session) {
                session.call('ttt:find2', [input.playername])
                .catch(function(err) {
                    console.error('error while joining game', err);
                });
            });
        };

        $scope.cancelGame = function(input) {
            $scope.input = input;
            WampService.then(function(session) {
                session.call('ttt:del2', [input.matchname])
                .then(function() {
                    if (!$scope.matchlist.hasOwnProperty(input.matchname)) {
                        $scope.match = null;
                    } else {
                        $scope.match = $scope.matchlist[input.matchname];
                        $rootScope.$broadcast('onMatchUpdated', $scope.match, $scope.input.playername);
                    }
                }, function(err) {
                    console.error('error while cancelling game', err);
                });
            });
        };

        $scope.publishGame = function() {
            WampService.then(function(session) {
                session.publish('ttt:matchlist', [$scope.matchlist], {}, {acknowledge: true})
                .then(function(publication) {
                    console.debug('matchlist published');
                }, function(err) {
                    console.error('error while updating game', err);
                });
            });
        };

        $scope.$watch('input.matchname', function(newValue, oldValue) {
            if (newValue !== oldValue && $scope.matchlist.hasOwnProperty(newValue)) {
                $scope.match = $scope.matchlist[newValue];
            }
        });

        $scope.$watch('match', function(newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.publishGame();
            }
        }, true);

        $rootScope.$on('onFieldPieceChanged', function(ev, match) {
            match.winner = calculateMatchWinner(match.field);
            $scope.match = match;
        });

        function calculateMatchWinner(field) {
            for (var row = 0; row < field.length; row++) {
                for (var col = 0; col < field[row].length; col++) {
                    if (field[row][col] > 0) {
                        try {
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
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
            return null;
        }
    }
}());
