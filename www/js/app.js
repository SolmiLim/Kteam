var __hasProp = {}.hasOwnProperty,
    __extends = function (child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'Parse'])

.run(function ($state, $rootScope) {

    Parse.initialize("ommvzsuCUEuEotQLnIeXaTy0rognYNucOVXn0aYb", "L8rAKk86fzL44wrmKwF1NTjJlI7WVFavrZljopb5");
    var currentUser = Parse.User.current();
    $rootScope.user = null;
    $rootScope.isLoggedIn = false;

    if (currentUser) {
        $rootScope.user = currentUser;
        $rootScope.isLoggedIn = true;
        $state.go('app.categories');
    }
})



.config(function ($stateProvider, $urlRouterProvider, ParseProvider, $stateProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('welcome', {
        url: '/welcome?clear',
        templateUrl: 'templates/welcome.html',
        controller: 'WelcomeController'
    })

    .state('app', {
        url: '/app?clear',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppController'
    })


    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            }
        }
    })

    .state('app.forgot', {
        url: '/forgot',
        views: {
            'menuContent': {
                templateUrl: 'templates/forgotPassword.html',
                controller: 'ForgotPasswordController'
            }
        }
    })

    .state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterController'
            }
        }
    })


    .state('app.categories', {
        cache: false,
        url: '/categories',
        views: {
            'menuContent': {
                templateUrl: 'templates/tab-categories.html',
                controller: 'CategoriesCtrl'
            }
        }
    })

    // 여기 바꾸기
    .state('app.categoryShow', {
        url: '/categoryShow/:categoryId',
        views: {
            'menuContent': {
                templateUrl: 'templates/category-show.html',
                controller: 'CategoryDetailCtrl'
            }
        }
    })

    .state('app.category-detail', {
        url: '/category/:categoryId',
        views: {
            'menuContent': {
                templateUrl: 'templates/category-detail.html',
                controller: 'CategoryDetailCtrl'
            }
        }
    })

    //참여한 공구보기
    .state('app.buySum', {
        cache: false,
        url: '/buySum',
        views: {
            'menuContent': {
                templateUrl: 'templates/buySum.html',
                controller: 'BuySumCtrl'
            }
        }
    })

    //진행중인 공구보기
    .state('app.sellSum', {
            cache: false,
            url: '/sellSum',
            views: {
                'menuContent': {
                    templateUrl: 'templates/sellSum.html',
                    controller: 'SellSumCtrl'
                }
            }
        })
        // 진행중인 공구 리스트 클릭 시 
        .state('app.sell-detail', {
            url: '/sell-detail/:categoryId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/sell-detail.html',
                    controller: 'SellDetailCtrl'
                }
            }
        })

    .state('app.userinfo', {
        cache: false,
        url: '/userinfo',
        views: {
            'menuContent': {
                templateUrl: 'templates/userinfo.html',
                controller: 'UserInfoCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/welcome');
    // initialize Parse
    return ParseProvider.initialize(
        "ommvzsuCUEuEotQLnIeXaTy0rognYNucOVXn0aYb", //App ID
        "M4OPWiV74Un3sL9F6OvLtsGM4G9UevRqjRBF05Zi" //REST API Key
    );
})

;
