(function () {
    'use strict';

    angular.module('app.fieldGrid', [
        'app.fieldPiece'
    ]).directive('fieldGrid', FieldGrid);

    function FieldGrid() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/field-grid.tpl.html',
            scope: {
                field: '='
            },
            link: linkFn
        }

        function linkFn(scope, elem, attrs) {
            if (!scope.field) {
                throw new Error('field attribute expected');
            }
        }
    }
}());
