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
            },
            link: linkFn
        }

        function linkFn(scope, elem, attrs) {
            scope.state = $rootScope.field[scope.row][scope.col];

            console.debug(scope.row, scope.col, scope.state);

            scope.setState = function(state) {
                if (scope.state === 0) {
                    scope.state = state;
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
