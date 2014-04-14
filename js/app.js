
angular.module('survivalApp', [ 'ngRoute', 'ngResource', 'ui'])// 'ngCookies', 'ngSanitize',
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