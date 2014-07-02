(function () {
    'use strict';

    angular.module('app', [
        'app.templates',
        'app.fieldGrid',
        'app.dialog',
        'app.wampService',
        'app.sessionService'
    ]).controller('appController', AppController);

    function AppController($rootScope, $scope, $timeout, WampService, SessionService) {
        function onSubscriptionEvent(args) {
            if ($scope.input.playername === null || angular.equals($scope.matchlist, args[0])) {
                return;
            }
            $scope.matchlist = args[0];
            if ($scope.matchlist.hasOwnProperty($scope.input.matchname)) {
                $scope.match = $scope.matchlist[$scope.input.matchname];
            } else {
                Object.keys($scope.matchlist).forEach(function(matchname) {
                    if ($scope.matchlist[matchname].player1 === $scope.input.playername ||
                        $scope.matchlist[matchname].player2 === $scope.input.playername) {
                        $scope.match = $scope.matchlist[matchname];
                        $scope.input.matchname = matchname;
                    }
                });
            }
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
            $scope.input = SessionService.getSession({
                playername: null,
                matchname: null
            });
        };
        $scope.init();

        $scope.createGame = function(input) {
            $scope.input = SessionService.setSession(input);
            WampService.then(function(session) {
                session.call('ttt:add2', [input.playername, input.matchname])
                .catch(function(err) {
                    console.error('error while creating game', err);
                });
            });
        };

        $scope.joinGame = function(input) {
            $scope.input = SessionService.setSession(input);
            WampService.then(function(session) {
                session.call('ttt:find2', [input.playername])
                .catch(function(err) {
                    console.error('error while joining game', err);
                });
            });
        };

        $scope.cancelGame = function(input) {
            $scope.input = SessionService.setSession(input);
            WampService.then(function(session) {
                session.call('ttt:del2', [input.matchname])
                .then(function() {
                    if (!$scope.matchlist.hasOwnProperty(input.matchname)) {
                        $scope.match = null;
                    } else {
                        $scope.match = $scope.matchlist[input.matchname];
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

        $scope.updateBoard = function() {
            $timeout(function() {
                $scope.$broadcast('onMatchUpdated', [$scope.match, $scope.input.playername]);
            });
        };

        $scope.$watch('input.matchname', function(newValue, oldValue) {
            if (newValue !== oldValue && $scope.matchlist.hasOwnProperty(newValue)) {
                $scope.match = $scope.matchlist[newValue];
            }
        });

        $scope.$watch('match', function(newValue, oldValue) {
            if (newValue !== oldValue && !angular.equals(newValue, {})) {
                $scope.updateBoard();
                $scope.publishGame();
            }
        }, true);

        $rootScope.$on('onFieldPieceChanged', function(ev, match) {
            $scope.match = match;
        });
    }
}());
