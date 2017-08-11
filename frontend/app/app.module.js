(function () {
'use strict';

/**
   * Config for the router
   */
angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngSanitize',
    'ui.utils.masks',
    'idf.br-filters',
    'ngFileUpload',
    'ngLodash',
    'ui.calendar',
    'toaster',
    'core',
    'login',
    'dashboard',
    'cadastro',
    'decks',
])

.filter('nl2br', ['$sanitize', function ($sanitize) {
        var tag = (/xhtml/i).test(document.doctype) ? '<br />' : '<br>';
        return function (msg) {
            msg = (msg + '').replace(/(\r\n|\n\r|\r|\n|&#10;&#13;|&#13;&#10;|&#10;|&#13;)/g, tag + '$1');
            return $sanitize(msg);
        };
    },
])

.config(configuration);

configuration.$inject = ['$urlRouterProvider'];

function configuration($urlRouterProvider) {
    $urlRouterProvider.otherwise('/decks');
}

angular.module('app').factory('authInterceptor', authInterceptor);

authInterceptor.$inject = ['$rootScope', '$q', '$window', '$location'];
function authInterceptor($rootScope, $q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers.Authorization = $window.localStorage.token;
            }

            return config;
        },

        response: function (response) {
            var notFound = (response.status === 401 || response.data.login === true);
            var needLogin =  ($location.path() !== '' && $location.path() !== '/cadastro');
            if (notFound && needLogin) {
                $window.localStorage.token = '';
                $location.path('/login');
            }

            return response || $q.when(response);
        },
    };
}

/*Injeta Autenticação*/
angular.module('app').config(injectAuth);

injectAuth.$inject = ['$httpProvider'];

function injectAuth($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}

/*Set de token a cada request*/
angular.module('app').run(setToken);

setToken.$inject = ['$rootScope', 'JwtService', '$location', '$state', '$window'];

function setToken($rootScope, JwtService, $location, $state, $window) {

    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function () {
        if ($location.search().token) {
            JwtService.setToken($location.search().token);
        }

        /*ADD VALIDACAO FAZER O QUE QUISER COM O TOKEN*/
        var tokenNotfound = (!JwtService.getToken() || JwtService.getToken() == 'null');
        var needLogin = ($location.path() !== '/login' && $location.path() !== '/cadastro' && $location.path() !== '');

        if (tokenNotfound && needLogin) {
            $location.path('/login');
            $window.location.reload();
        }
    });
}

angular.module('app').run(validateFilter);

validateFilter.$inject = ['$window'];

function validateFilter($window) {
    var code = 'E';

    if ($window.localStorage.code !== code) {
        $window.localStorage.removeItem('filtro');
    }

    $window.localStorage.code = code;
}
})();
