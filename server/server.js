var autobahn = require('autobahn')
    , q = require('q')
    , debug = require('debug')('ttt');

function generateField(rows, cols) {
    var field = [];
    for (var i = 0; i < rows; i++) {
        field[i] = [];
        for (var j = 0; j < cols; j++) {
            field[i][j] = 0;
        }
    }
    return field;
}

var connection = new autobahn.Connection({
    url: 'ws://127.0.0.1:3000/ttt',
    realm: 'demos',
    use_deferred: q.defer
});

connection.onopen = function(session) {
    session.prefix('ttt', 'de.sonnenkarma.demos.ttt');
    var matchlist = {};

    var funcs = {
        add2: function(args) {
            var match = {
                player1: args[0],
                player2: null,
                next: Math.floor((Math.random() * 2) + 1),
                field: generateField(3, 3),
                created: new Date()
            };
            matchlist[args[1]] = match;
            debug(matchlist);
            return [matchlist];
        },
        find2: function(args) {
            Object.keys(matchlist).forEach(function(matchname) {
                if (!matchlist[matchname].player2) {
                    matchlist[matchname].player2 = args[0];
                }
            });
            debug(matchlist);
            return [matchlist];
        },
        del2: function(args) {
            if (matchlist[matchname]) {
                delete matchlist[matchname];
            }
            return [matchlist];
        }
    }

    Object.keys(funcs).forEach(function(funcName) {
        session.register('ttt:' + funcName, funcs[funcName])
        .then(function(registration) {
            debug('function "' + registration.procedure + '" registered');
        }, function(err) {
            throw err;
        });
    });

    function publish() {
        session.publish('ttt:matchlist', [matchlist]);
    }

    function onevent(args) {
        matchlist = args[0];
        publish();
    }
    session.subscribe('ttt:matchlist', onevent)
    .then(function(subscription) {
        debug('subscribed to topic "' + subscription.topic + '"');
    }, function(err) {
        throw err;
    });
};

connection.open();
