angular.module('survivalApp')
  .controller('DisplayManagerCtrl', function ($scope, 
    DEBUG, FoodManagerService, CellManagerService,
    DebugLessService, ThreeJSRendererService, TemplatesService,
    StringsService, KeyboardService, TileManagerService, $interval, $cookies, LevelManagerService
  ) {//$timeout, , 
    'use strict'; 
/**
 * @ngdoc module
 * @name survival.DisplayManager
 * @description #Display Manager
 *  The display manager talks directly to the other mangagers,
 *  and creates a hud with the various details.
 */
    
    console.log('$cookies', $cookies);
    if ($cookies.hideCells === 'true') {
      $scope.hideCells = true;
    } else {
      $scope.hideCells = false;
    }
    
    if ($cookies.hideDrawer === 'true') {
      $scope.hideDrawer = true;
    } else {
      $scope.hideDrawer = false;
    }
    
    if ($cookies.hideWorker === 'true') {
      $scope.hideWorker = true;
    } else {
      $scope.hideWorker = false;
    }
    
    if ($cookies.hideStats === 'true') {
      $scope.hideStats = true;
    } else {
      $scope.hideStats = false;
    }

    $scope.$watch('hideStats', function () {
      $cookies.hideStats = $scope.hideStats;
    });

    $scope.$watch('hideWorker', function () {
      $cookies.hideWorker = $scope.hideWorker;
    });

    $scope.$watch('hideDrawer', function () {
      $cookies.hideDrawer = $scope.hideDrawer;
    });
    
    $scope.$watch('hideCells', function () {
      $cookies.hideCells = $scope.hideCells;
    });
    
    $scope.updateKeyboardBinding = function (drivable) {
      console.log('drivable', drivable);
      $scope.$emit('updateKeyboardBinding', drivable.type);
      $cookies.drivableType = drivable.type;
    };
    $scope.cells = CellManagerService.cells;
    
    $scope.$on('updateCells', function () {
      console.log('updateCells');
      $scope.cells = CellManagerService.cells;
    });
    $scope.drivable = [
      {
        name: 'disabled',
        type: 'disabled'
      },
      {
        name: 'camera',
        type: 'camera'
      },
      {
        name: 'food',
        type: 'food'
      },
      {
        name: 'cell',
        type: 'cell'
      }
    ];
    if ($cookies.drivableType !== undefined) {
      var didSet = false;
      for (var i = $scope.drivable.length - 1; i >= 0; i--) {
        if ($cookies.drivableType === $scope.drivable[i].type) {
          $scope.driveThis = $scope.drivable[i];
          $scope.updateKeyboardBinding($scope.drivable[i]);
          didSet = true;
          break;
        }
      }
      if (!didSet) {
        $scope.driveThis = $scope.drivable[3];        
        $scope.updateKeyboardBinding($scope.drivable[3]);
      }
    }
    $scope.workerBlobText = LevelManagerService.workerBlobText;

    $scope.debug = DEBUG;

    TemplatesService.retrieve().$promise.then(function (data) {
      $scope.templates = data.templates;
    });
    $scope.foodSourceCount = function () {
      var count = 0;
      angular.forEach(FoodManagerService.foodSources, function () {
        count ++;
      });
      return count;
    };
    $scope.cellCount = function () {
      var count = 0;
      angular.forEach(CellManagerService.cells, function () {
        count ++;
      });
      return count;
    };
    $scope.tileCount = function () {
      var count = 0;
      angular.forEach(TileManagerService.tiles, function () {
        count ++;
      });
      return count;
    };
    $scope.renderFunctionCount = function () {
      return ThreeJSRendererService.onRenderFcts.length;
    };
    $scope.runWorker = function () {
      $scope.$emit('updateWorker', document.getElementById('workerCode').value);
    };
    $scope.lastDrivable = $scope.driveThis;
    $scope.workerInputHasFocus = function (hasFocus) {
      console.log('hasFocus', hasFocus);
      KeyboardService.defaultPrevention = !hasFocus;
      if (hasFocus) {
        $scope.lastDrivable = $scope.driveThis;
        $scope.updateKeyboardBinding($scope.drivable[0]);
      } else {
        
        $scope.updateKeyboardBinding($scope.lastDrivable);
      }
    };
  });