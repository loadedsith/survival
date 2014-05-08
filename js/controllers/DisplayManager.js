/*global requestAnimationFrame: false */

angular.module('survivalApp')
  .controller('DisplayManagerCtrl', function ($scope, 
    DEBUG, FoodManagerService, CellManagerService,
    DebugLessService, ThreeJSRendererService, TemplatesService,
    StringsService, KeyboardService, TileManagerService
  ) {//$timeout, $interval, 
    'use strict'; 
/**
 * @ngdoc module
 * @name survival.DisplayManager
 * @description #Display Manager
 *  The display manager talks directly to the other mangagers,
 *  and creates a hud with the various details.
 */
    $scope.debug = DEBUG;
    
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
  });