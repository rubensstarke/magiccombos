(function () {
'use strict';

angular.module('login', []).config(states);

states.$inject = ['$stateProvider', 'LoadingProvider'];

function states($stateProvider, LoadingProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                '': {
                    templateUrl: LoadingProvider.uncache('app/modules/login/home.html'),
                    controller: 'LoginController',
                    controllerAs: 'vm',
                },
                nav: {
                    templateUrl: LoadingProvider.uncache('app/templates/nav.html'),
                },
            },
        }).state('logout', {
            url: '/logout',
            views: {
                '': {
                    controller: LogoutController,
                },
            },
        });

    LogoutController.$inject = ['$window', '$state'];

    function LogoutController($window, $state) {
        $window.localStorage.token = null;
        $state.go('login', {}, { reload: true, inherit: false });
    }
}

})();
