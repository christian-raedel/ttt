(function () {
    'use strict';

    angular.module('app.fieldPiece', [])
    .directive('fieldPiece', FieldPiece);

    function FieldPiece() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/field-piece.tpl.html',
            scope: {
                row: '=',
                col: '='
            },
            link: linkFn
        }

        function linkFn(scope, elem, attrs) {
            scope.$on('onMatchUpdated', function(ev, args) {
                console.debug('onMatchUpdated');
                scope.match = args[0];
                scope.field = scope.match.field[scope.row][scope.col];
                scope.localPlayer = scope.match.player1 === args[1] ? 1 : 2;
            });

            scope.setState = function() {
                console.debug('setState');
                if (scope.match.next !== scope.localPlayer) {
                    return;
                }
                if (scope.field.player === 0) {
                    scope.field.player = scope.localPlayer;
                    scope.match.field[scope.row][scope.col] = scope.field;
                    scope.match.last = {
                        row: scope.row,
                        col: scope.col
                    };
                    scope.match.next = scope.match.next === 1 ? 2 : 1;
                    scope.$emit('onFieldPieceChanged', scope.match);
                }
            };
        }
    }
}());
