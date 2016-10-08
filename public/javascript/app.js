angular.module('picterest', ['ui.router'])
    .config(function ($locationProvider, $urlRouterProvider, $stateProvider, $httpProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/public/templates/home.html',
                controller: 'LoginCtrl'
            })
            .state('publicwall', {
                url: '/publicwall',
                templateUrl: '/public/templates/publicwall.html',
                controller: 'PublicCtrl'
            })
            .state('userwall', {
                url: '/users/:username',
                templateUrl: '/public/templates/userwall.html',
                controller: 'UserwallCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: '/public/templates/signup.html',
                controller: 'SignUpCtrl'
            })
            .state('mywall', {
                url: '/mywall',
                templateUrl: '/public/templates/mywall.html',
                controller: 'MyWallCtrl'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '/public/templates/settings.html',
                controller: 'SettingsCtrl'
            })
            .state('nouser', {
                url: '/nouser',
                template: '<h3 class="text-center white">Oops! Sorry no user found!</h3>'
            })
            .state('logout', {
                url: '/logout',
                template: '<h3>Logging Out</h3>',
                controller: 'LogoutCtrl'
            });

        $httpProvider.interceptors.push('authInterceptor');
    });










