
angular.module('threejs', [ 'ngRoute', 'ngCookies', 'ngResource', 'ngSanitize', 'ui'])
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