(function() {
    'use strict';

    angular.module('app.playerInfo', [])
    .directive('playerInfo', PlayerInfo);

    function PlayerInfo() {
        return {
            restrict: 'E',
            templateUrl: 'app/player-info.tpl.html',
            scope: {
                playername: '=',
                isHuman: '='
            },
            link: linkFn
        };

        function linkFn(scope, elem, attrs) {
            /*
            if (!scope.playername) {
                throw new Error('playername attribute expected');
            }
            */
        }
    }
}());
