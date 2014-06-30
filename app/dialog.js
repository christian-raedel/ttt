(function() {
    'use strict';

    angular.module('app.dialog', [])
    .directive('dialog', Dialog);

    function Dialog() {
        return {
            restrict: 'E',
            templateUrl: 'app/dialog.tpl.html',
            transclude: true,
            replace: true,
            scope: {
                title: '@',
                doConfirm: '&onConfirm',
                doCancel: '&onCancel',
                show: '='
            },
            link: linkFn
        };

        function linkFn(scope, elem, attrs) {
            scope.input = {};

            scope.cancel = function() {
                if (scope.doCancel) {
                    scope.doCancel({input: scope.$$nextSibling.input});
                }
                scope.show = false;
            };

            scope.confirm = function() {
                if (scope.doConfirm) {
                    scope.doConfirm({input: scope.$$nextSibling.input});
                }
                scope.show = false;
            };
        }
    }
}());
