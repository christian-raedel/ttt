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
            scope.state = $rootScope.match.field[scope.row][scope.col];

            scope.setState = function(state) {
                if (scope.state === 0) {
                    scope.state = state;
                }
            };
        }
    }
}());
