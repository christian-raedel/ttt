describe('WampService', function() {
    var WampService = null;

    beforeEach(function() {
        module('app.WampService');
        inject(function(_WampService_) {
            WampService = _WampService_;
        });
    });

    it('should has callable functions', function() {
        expect(WampService.open).to.be.a('function');
        expect(WampService.call).to.be.a('function');
        expect(WampService.publish).to.be.a('function');
        expect(WampService.subscribe).to.be.a('function');
        expect(WampService.unsubscribe).to.be.a('function');
    });

    it('should be connected to a wamp server', function(done) {
        WampService.open();
        WampService.session.promise.then(function(session) {
            expect(session.isOpen).to.be.true;
            done();
        }, function(err) {
            done(err);
        });
    });

    it('should create a match', function(done) {
        WampService.call('add2', ['user1', 'testmatch'])
        .then(function(args) {
            expect(args[0]).to.be.ok;
            var matchlist = args[0];
            expect(matchlist['testmatch'].player1).to.be.equal('user1');
            done();
        }, function(err) {
            done(err);
        });
    });

    it('should join a match', function(done) {
        WampService.call('find2', ['user2'])
        .then(function(args) {
            expect(args[0]).to.be.ok;
            var matchlist = args[0];
            expect(matchlist['testmatch'].player2).to.be.equal('user2');
            done();
        }, function(err) {
            done(err);
        });
    });

    it('should subscribe to matchlist', function(done) {
        function onEvent(args) {
            console.debug(args);
            expect(args[0]).to.be.ok;
            done();
        }
        WampService.subscribe(onEvent);
    });
});
