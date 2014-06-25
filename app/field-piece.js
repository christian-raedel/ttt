(function () {
    'use strict';

    angular.module('app.fieldPiece', [])
    .directive('fieldPiece', FieldPiece);

    function FieldPiece($rootScope) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/field-piece.tpl.html',
            scope: {
                row: '=',
                col: '=',
                player: '='
            },
            link: linkFn
        }

        function linkFn(scope, elem, attrs) {
            scope.state = $rootScope.match.field[scope.row][scope.col];
            scope.next = $rootScope.match.next;

            $rootScope.$watch('playername', function(newValue, oldValue) {
                if (newValue === $rootScope.match.player1) {
                    scope.localPlayer = 1;
                } else {
                    scope.localPlayer = 2;
                }
            });

            scope.setState = function(state) {
                console.debug(scope.localPlayer);
                if ($rootScope.match.next !== scope.localPlayer) {
                    return;
                }
                if (scope.state === 0) {
                    scope.state = state;
                    $rootScope.match.field[scope.row][scope.col] = state;
                    if ($rootScope.match.next === 1) {
                        $rootScope.match.next = 2;
                    } else {
                        $rootScope.match.next = 1;
                    }
                    scope.next = $rootScope.match.next;
                }
            };
        }
    }
}());
