angular.module('survivalApp')
  .service('KeyboardService', function () {//$interval, $timeout
    'use strict';
    var keyboard = this,
      $scope = {},
      message = 'keyboardMovementEvent',
      preventDefault = function ($event) {
        $event.preventDefault();
      };
      
    keyboard.setScope = function (scope) {
      $scope = scope;
    };
    
    var up = new THREE.Vector3(0, 0, -1),
    down = new THREE.Vector3(0, 0, 1),
    left = new THREE.Vector3(-1,  0, 0),
    right = new THREE.Vector3(1, 0, 0),
    space = new THREE.Vector3(0, 1, 0),
    e = new THREE.Vector3(0, 1, 0),
    f = new THREE.Vector3(0, -1,  0),
    c = new THREE.Vector3(0, -1,  0),
    stop = new THREE.Vector3(0, 0, 0);
    
    
    
    keyboard.keyDown = function ($event) {
      preventDefault($event);
      return {
        enter: function () {},
        up :   function () {$scope.$broadcast(message, up); },
        down:  function () {$scope.$broadcast(message, down); },
        left:  function () {$scope.$broadcast(message, left); },
        right: function () {$scope.$broadcast(message, right); },
        space: function () {$scope.$broadcast(message, space); },
        e:     function () {$scope.$broadcast(message, e); },
        f:     function () {$scope.$broadcast(message, f); },
        c:     function () {$scope.$broadcast(message, c); }
      };
    };
    
    keyboard.keyUp = function ($event) {
      preventDefault($event);
      return {
        enter: function () {},
        up :   function () {$scope.$broadcast(message, stop); },
        down:  function () {$scope.$broadcast(message, stop); },
        left:  function () {$scope.$broadcast(message, stop); },
        right: function () {$scope.$broadcast(message, stop); },
        space: function () {$scope.$broadcast(message, stop); },
        e:     function () {$scope.$broadcast(message, stop); },
        f:     function () {$scope.$broadcast(message, stop); },
        c:     function () {$scope.$broadcast(message, stop); }
      };
    };
  });