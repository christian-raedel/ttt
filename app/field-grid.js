(function () {
    'use strict';

    angular.module('app.fieldGrid', [
        'app.fieldPiece',
        'app.playerInfo'
    ]).directive('fieldGrid', FieldGrid);

    function FieldGrid() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/field-grid.tpl.html',
            scope: {
                match: '='
            },
            link: linkFn
        }

        function linkFn(scope, elem, attrs) {
        }
    }
}());
