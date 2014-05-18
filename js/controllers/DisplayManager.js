/*global requestAnimationFrame: false */

angular.module('survivalApp')
  .controller('DisplayManagerCtrl', function ($scope, 
    DEBUG, FoodManagerService, CellManagerService,
    DebugLessService, ThreeJSRendererService, TemplatesService,
    StringsService, KeyboardService, TileManagerService, $interval
  ) {//$timeout, , 
    'use strict'; 
/**
 * @ngdoc module
 * @name survival.DisplayManager
 * @description #Display Manager
 *  The display manager talks directly to the other mangagers,
 *  and creates a hud with the various details.
 */
    
    
    $scope.hideCells = true;
    
    $scope.updateKeyboardBinding = function (drivable) {
      console.log('drivable', drivable);
      $scope.$emit('updateKeyboardBinding', drivable.type);
    }
    $scope.cells = CellManagerService.cells;
    
    $scope.$on('updateCells', function () {
      console.log('updateCells');
      $scope.cells = CellManagerService.cells;
    });
    $scope.drivable = [
      {
        name:'camera',
        type:'camera'
      },
      {
        name:'food',
        type:'food'
      },
      {
        name:'cell',
        type:'cell'
      }
    ];
    $scope.driveThis = $scope.drivable[2];
    $scope.updateKeyboardBinding($scope.drivable[2]);
    $scope.debug = DEBUG;
    $scope.$watch('driveThis', function(scope, newValue, oldValue) {
      console.log(oldValue, newValue);    
    });
    TemplatesService.retrieve().$promise.then(function (data) {
      $scope.templates = data.templates;
    });
    $scope.foodSourceCount = function () {
      var count = 0;
      angular.forEach(FoodManagerService.foodSources, function(value, key){
        count ++;
      });
      return count;
    }
    $scope.cellCount = function () {
      var count = 0;
      angular.forEach(CellManagerService.cells, function(value, key){
        count ++;
      });
      return count;
    }
    $scope.tileCount = function () {
      var count = 0;
      angular.forEach(TileManagerService.tiles, function(value, key){
        count ++;
      });
      return count;
    }
    $scope.renderFunctionCount = function () {
      return ThreeJSRendererService.onRenderFcts.length;
    }
    $scope.runWorker = function () {
      $scope.$emit('updateWorker', document.getElementById('workerCode').value);
    };
  });