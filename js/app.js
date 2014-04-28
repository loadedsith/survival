var app = angular.module('survivalApp', [ 'ngRoute', 'ngResource', 'ui'])// 'ngCookies', 'ngSanitize',
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

app.constant('DEBUG', /* @echo  DEBUG */ || false);// jshint ignore:line
