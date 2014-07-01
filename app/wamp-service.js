(function() {
    'use strict';

    angular.module('app.wampService', [])
    .factory('WampService', WampService);

    function WampService($rootScope, $q) {
        var defer = $q.defer();

        var connection = new autobahn.Connection({
            url: 'ws://127.0.0.1:3000/ttt',
            realm: 'demos',
            use_deferred: $q.defer
        });

        connection.onopen = function(session) {
            //console.debug('wamp session opened', session);
            $rootScope.$apply(function() {
                session.prefix('ttt', 'de.sonnenkarma.demos.ttt');
                defer.resolve(session);
            });
        }

        connection.open();

        return defer.promise;
    }
}());
