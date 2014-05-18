var app = angular.module('survivalApp', [ 'ngRoute', 'ngResource', 'ngCookies', 'ui'])// 'ngCookies', 'ngSanitize',
  .config(function ($routeProvider) {
    'use strict';

    $routeProvider
      .when('/', {
        templateUrl: '/js/views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  });

var debug = '/* @echo DEBUG */';
if (debug === '' || debug === 'false') {
  debug = false;
} else {
  debug = true;
}

app.constant('DEBUG', debug || false);