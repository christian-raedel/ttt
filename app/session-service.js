(function() {
    'use strict';

    angular.module('app.sessionService', [
        'ngCookies'
    ])
    .factory('SessionService', SessionService);

    function SessionService($cookieStore) {
        var service = {};

        service.setSession = function(session) {
            Object.keys(session).forEach(function(key) {
                if (!session[key]) {
                    $cookieStore.remove(key);
                } else {
                    $cookieStore.put(key, session[key]);
                }
            });
            return session;
        };

        service.getSession = function(session) {
            Object.keys(session).forEach(function(key) {
                session[key] = $cookieStore.get(key);
            });
            return session;
        };

        service.clearSession = function(session) {
            Object.keys(session).forEach(function(key) {
                $cookieStore.remove(key);
            });
            return session;
        };

        return service;
    }
}());
