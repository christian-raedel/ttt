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
    var matchlist = {};

    function add2(args) {
        var match = {
            1: args[0],
            2: null,
            field: generateField(3, 3),
            created: new Date()
        };
        matchlist[args[1]] = match;
        debug(matchlist);
        return [matchlist];
    }

    function find2(args) {
        Object.keys(matchlist).forEach(function(matchname) {
            if (!matchlist[matchname]['2']) {
                matchlist[matchname]['2'] = args[0];
            }
        });
        debug(matchlist);
        return [matchlist];
    }

    session.register('ttt.add2', add2);
    session.register('ttt.find2', find2);

    function publish() {
        session.publish('ttt.matchlist', [matchlist]);
    }

    function onevent(args) {
        matchlist = args[0];
    }
    session.subscribe('ttt.matchlist', onevent);
};

connection.open();
