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
            scope.$on('onMatchUpdated', function(ev, match, localPlayer) {
                console.debug('onMatchUpdated');
                scope.match = match;
                scope.state = match.field[scope.row][scope.col];
                scope.next = match.next;
                if (scope.match.player1 === localPlayer) {
                    scope.localPlayer = 1;
                } else {
                    scope.localPlayer = 2;
                }
            });

            scope.setState = function() {
                console.debug('setState');
                if (scope.match.next !== scope.localPlayer) {
                    return;
                }
                if (scope.state === 0) {
                    scope.state = scope.localPlayer;
                    scope.match.field[scope.row][scope.col] = scope.state;
                    if (scope.match.next === 1) {
                        scope.match.next = 2;
                    } else {
                        scope.match.next = 1;
                    }
                    scope.$emit('onFieldPieceChanged', scope.match);
                    scope.next = scope.match.next;
                }
            };
        }
    }
}());
