describe('<field-grid>', function() {
    var $compile = $rootScope = $scope = null;

    beforeEach(function() {
        module('app', 'app.fieldGrid');
        inject(function(_$compile_, _$rootScope_, _$controller_) {
            $compile = _$compile_;
            $scope = _$rootScope_.$new();
            _$controller_('appController', {$scope: _$rootScope_});
        });
    });

    it('should renders directive', function() {
        var elem = $compile('<field-grid field="field"></field-grid>')($scope);
        $scope.$digest();
        expect(elem).toBeDefined();
    });
});
