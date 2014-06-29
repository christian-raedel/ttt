(function() {
    'use strict';

    angular.module('app.playerInfo', [])
    .directive('playerInfo', PlayerInfo);

    function PlayerInfo() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/player-info.tpl.html',
            scope: {
                playerName: '=',
                isHuman: '=',
                isNext: '='
            },
            link: linkFn
        };

        function linkFn(scope, elem, attrs) {
        }
    }
}());
