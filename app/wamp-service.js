(function() {
    'use strict';

    angular.module('app.WampService', [])
    .factory('WampService', WampService);

    function WampService($q) {
        var service = {
            session: $q.defer()
        };

        var connection = new autobahn.Connection({
            url: 'ws://127.0.0.1:3000/ttt',
            realm: 'demos',
            use_deferred: $q.defer
        });

        connection.onopen = function(session) {
            console.debug('wamp session opened', session);
            session.prefix('ttt', 'de.sonnenkarma.demos.ttt');
            service.session.resolve(session);
        }

        connection.open();

        service.open = function() {
            if (!connection.isOpen) {
                connection.open();
            }
        };

        service.call = function(name, args) {
            var defer = $q.defer();
            service.session.promise.then(function(session) {
                defer.resolve(session.call('ttt:' + name, args));
            });
            return defer.promise;
        };

        service.publish = function(args) {
            var defer = $q.defer();
            service.session.promise.then(function(session) {
                defer.resolve(session.publish('ttt:matchlist', args, {}, {acknowledge: true}));
            });
            return defer.promise;
        };

        service.subscribe = function(onEvent) {
            var defer = $q.defer();
            service.session.promise.then(function(session) {
                defer.resolve(session.subscribe('ttt:matchlist', onEvent));
            });
            return defer.promise;
        };

        service.unsubscribe = function(subscription) {
            var defer = $q.defer();
            service.session.promise.then(function(session) {
                defer.resolve(session.unsubscribe(subscription));
            });
            return defer.promise;
        };

        return service;
    }
}());
