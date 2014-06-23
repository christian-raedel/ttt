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
                col: '=',
                state: '='
            },
            link: linkFn
        }

        function linkFn(scope, elem, attrs) {
            scope.setState = function(state) {
                if (scope.state === 0) {
                    scope.state = state;
                    scope.$emit('onStateChange', {
                        row: scope.row,
                        col: scope.col,
                        state: scope.state
                    });
                }
            };

            scope.getStateSymbol = function() {
                switch (scope.state) {
                    case 1:
                        return 'O';
                    break;
                    case 2:
                        return 'X';
                    break;
                    default:
                        return null;
                }
            };
        }
    }
}());
