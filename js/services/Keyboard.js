angular.module('survivalApp')
  .service('KeyboardService', function () {//$interval, $timeout
    var keyboard = this,
      $scope = {},
      preventDefault = function ($event) {
        $event.preventDefault();
      };
      
    keyboard.setScope = function (scope) {
      $scope = scope;
    }
    
    keyboard.keyDown=function ($event) {
      preventDefault($event);
      return{
        enter : function($event) {

        },
        up : function ($event){//up
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:-1})
        },
        down: function ($event){//down
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:1})
        },
        left: function ($event){//left
          $scope.$broadcast('cameraMovement',{x:-1,y:0,z:0})
        },
        right: function ($event){//right
          $scope.$broadcast('cameraMovement',{x:1,y:0,z:0})
        },
        space: function ($event){//space
          $scope.$broadcast('cameraMovement',{x:0,y:1,z:0})
        },
        e: function ($event){//e
          $scope.$broadcast('cameraMovement',{x:0,y:1,z:0})
        },
        f: function ($event){//f
          $scope.$broadcast('cameraMovement',{x:0,y:-1,z:0})
        },
        c: function ($event){//c
          $scope.$broadcast('cameraMovement',{x:0,y:-1,z:0})
        }
      };
    }
    
    keyboard.keyUp=function ($event) {
      preventDefault($event);
      return {
        enter : function($event) {//scope.scene
          $event.preventDefault();
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:0})
        },
        up : function ($event){//up up
          $event.preventDefault();
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:0})
        },
        down: function ($event){//down up
          $event.preventDefault();
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:0})
        },
        left: function ($event){//left up
          $event.preventDefault();
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:0})
        },
        right: function ($event){//right up
          $event.preventDefault();
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:0})
        },
        space: function ($event){//space up
          $event.preventDefault();
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:0})
        },
        e: function ($event){//e up
          $event.preventDefault();
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:0})
        },
        f: function ($event){//f up
          $event.preventDefault();
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:0})
        },
        c: function ($event){//c up
          $event.preventDefault();
          $scope.$broadcast('cameraMovement',{x:0,y:0,z:0})
        }
      };
    };
  });