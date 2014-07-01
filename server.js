var autobahn = require('autobahn')
    , q = require('q')
    , debug = require('debug')('ttt');

var size = 3;

function generateField() {
    var field = [];
    for (var i = 0; i < size; i++) {
        field[i] = [];
        for (var j = 0; j < size; j++) {
            field[i][j] = {
                state: 0,
                player: 0
            };
        }
    }
    return field;
}

function calculateMatchWinner(match) {
    if (!match.last) {
        debug('cancelled calculation');
        return null;
    }
    debug('calculate match winner');
    for (var row = match.last.row - 1; row < match.last.col + 2; row++) {
        for (var col = match.last.col - 1; col < match.last.col + 2; col++) {
            match.field[row][col].state += 1;
        }
    }

    for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
            if (match.field[row][col].state === size) {
                return match.field[row][col].player;
            }
        }
    }
    return null;
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
                last: null,
                winner: null,
                field: generateField(),
                created: new Date()
            };
            matchlist[args[1]] = match;
            debug(matchlist);
            publish();
        },
        find2: function(args) {
            Object.keys(matchlist).forEach(function(matchname) {
                if (!matchlist[matchname].player2) {
                    matchlist[matchname].player2 = args[0];
                }
            });
            debug(matchlist);
            publish();
        },
        del2: function(args) {
            if (matchlist[args[0]]) {
                delete matchlist[args[0]];
            }
            debug(matchlist);
            publish();
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
        debug('publishing matchlist...');
        Object.keys(matchlist).forEach(function(matchname) {
            matchlist[matchname].winner = calculateMatchWinner(matchlist[matchname]);
        });
        session.publish('ttt:matchlist', [matchlist], {}, {acknowledge: true});
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
