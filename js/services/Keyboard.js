angular.module('survivalApp')
  .service('KeyboardService', function () {//$interval, $timeout
    'use strict';
    var keyboard = this,
      $scope = {},
      preventDefault = function ($event) {
        $event.preventDefault();
      };
      
    keyboard.setScope = function (scope) {
      $scope = scope;
    };
    
    keyboard.keyDown = function ($event) {
      preventDefault($event);
      return {
        enter : function ($event) {

        },
        up : function ($event) {//up
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, -1))
        },
        down: function ($event) {//down
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 1))
        },
        left: function ($event) {//left
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(-1,  0, 0))
        },
        right: function ($event) {//right
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(1, 0, 0))
        },
        space: function ($event) {//space
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 1, 0))
        },
        e: function ($event) {//e
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 1, 0))
        },
        f: function ($event) {//f
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, -1,  0))
        },
        c: function ($event) {//c
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, -1,  0))
        }
      };
    }
    
    keyboard.keyUp=function ($event) {
      preventDefault($event);
      return {
        enter : function($event) {//scope.scene
          $event.preventDefault();
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 0))
        },
        up : function ($event) {//up up
          $event.preventDefault();
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 0))
        },
        down: function ($event) {//down up
          $event.preventDefault();
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 0))
        },
        left: function ($event) {//left up
          $event.preventDefault();
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 0))
        },
        right: function ($event) {//right up
          $event.preventDefault();
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 0))
        },
        space: function ($event) {//space up
          $event.preventDefault();
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 0))
        },
        e: function ($event) {//e up
          $event.preventDefault();
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 0))
        },
        f: function ($event) {//f up
          $event.preventDefault();
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 0))
        },
        c: function ($event) {//c up
          $event.preventDefault();
          $scope.$broadcast('keyboardMovementEvent', new THREE.Vector3(0, 0, 0))
        }
      };
    };
  });