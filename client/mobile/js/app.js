// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngResource', 'ngCookies'])

  .run(function ($ionicPlatform, $rootScope, $location, Auth) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
    $ionicConfigProvider.tabs.position('bottom');
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: "templates/login.html",
        controller: "LoginCtrl"
      })
      .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: "RegisterCtrl"
      })
      // setup an abstract state for the tabs directive
      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        authenticate: true
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        authenticate: true,
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.message', {
        url: '/message',
        authenticate: true,
        views: {
          'tab-message': {
            templateUrl: 'templates/tab-message.html',
            controller: 'MessageCtrl'
          }
        }
      })
      .state('tab.search', {
        url: '/search',
        authenticate: true,
        views: {
          'tab-search': {
            templateUrl: 'templates/tab-search.html',
            controller: 'SearchCtrl'
          }
        }
      })
      .state('tab.manager', {
        url: '/manager',
        authenticate: true,
        views: {
          'tab-manager': {
            templateUrl: 'templates/tab-manager.html',
            controller: 'ManagerCtrl'
          }
        }
      })
      .state('tab.templist', {
        url: '/templist',
        authenticate: true,
        views: {
          'tab-manager': {
            templateUrl: 'templates/tab-templist.html',
            controller: 'TemplistCtrl'
          }
        }
      })
      .state('tab.tempedit', {
        url: '/tempedit/:id',
        authenticate: true,
        views: {
          'tab-manager': {
            templateUrl: 'templates/tab-tempedit.html',
            controller: 'TempeditCtrl'
          }
        }
      })
        .state('tab.tempAdd', {
          url: '/tempadd',
          authenticate: true,
          views: {
            'tab-manager': {
              templateUrl: 'templates/tab-tempadd.html',
              controller: 'TempaddCtrl'
            }
          }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

  })
  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

;
