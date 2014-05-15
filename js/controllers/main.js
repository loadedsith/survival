angular.module('survivalApp')
	.controller('MainCtrl', function ($scope, $http, $interval,
                                    DEBUG, FoodManagerService, CellManagerService,
                                    DebugLessService, ThreeJSRendererService, TemplatesService,
                                    StringsService, KeyboardService, TileManagerService
                                  ) {
	'use strict';
  
  
  $scope.DEBUG = DEBUG;

  $scope.movementVector = new THREE.Vector3(0, 0, 0);

  DebugLessService.init();
  
  TemplatesService.retrieve().$promise.then(function (data) {
    $scope.templates = data.templates;
  });
  StringsService.retrieve().$promise.then(function (data) {
    $scope.strings = data;
  });
  
  $scope.noiseSeed = noise.seed(Math.random());
  KeyboardService.setScope($scope);
  $scope.keyUp = KeyboardService.keyUp;
  $scope.keyDown = KeyboardService.keyDown;
  $scope.doOnce = true;
  
  $scope.driveThis = 'cell';
  
  $scope.keyboardMovement = function (delta) {
    var movement = new THREE.Vector3($scope.movementVector.y, $scope.movementVector.x, $scope.movementVector.z),
    deltaV = new THREE.Vector3(delta, delta, delta);
    movement.multiply(deltaV);
    DebugLessService.msg = ['keyboardMovement', movement];

    switch ($scope.driveThis) {
    case 'camera':
      var camera = ThreeJSRendererService.camera;
      camera.position.add(movement);
      break;
    case 'food':
      var foodMesh = FoodManagerService.foodSource.mesh;
      foodMesh.position.add(movement);
      break;
    case 'cell':
      var cellMesh = CellManagerService.cell.mesh;
      cellMesh.position.add(movement);
      break;
    default:
      camera.position.add(movement);    
      break;
    }
  };
  
  $scope.shouldAddCameraLoopFunction = true;
  $scope.$on('keyboardMovementEvent', function (event, attributes) {
    //Key binding is defined in the keyboad service, which emits this event
    $scope.movementVector = attributes;
    if ($scope.shouldAddCameraLoopFunction) {
      ThreeJSRendererService.onRenderFcts.push($scope.keyboardMovement);
      $scope.shouldAddCameraLoopFunction = false;
    }
  });
  

  $scope.shouldAddTilesToRenderUpdates = true;

  $scope.addTilesToScene = function () {
    var rows = 16,
        columns = 16,
        scale = 0.1,
        gridHeight = scale,
        gridWidth = scale;
    
    $scope.tms = TileManagerService;
    $scope.tms.makeTileGrid({
      'rows' : rows,
      'columns' : columns,
      'scale':{
        x: scale,
        y: scale,
        z: scale
      },
      'gridHeight' : gridHeight,
      'gridWidth' : gridWidth,
      'positionOffset': {
        x: -0.5 * rows * gridHeight,
        y: -0.5 * columns * gridWidth,
        z: 0
      },
      'positionCallback' : TileManagerService.positionCallbacks.land
    }).then(function (newTiles) {
      CellManagerService.land = [];
      for (var i = newTiles.length - 1; i >= 0; i--) {
        CellManagerService.land[i] = newTiles[i].tile.mesh;
        ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
      }
    });
    
    
    $scope.water = TileManagerService;
    $scope.doOnce = true;
    $scope.water.makeTileGrid({
      'rows' : rows,
      'columns' : rows,
      'scale':{
        x: scale,
        y: scale,
        z: scale
      },
      'gridHeight' : gridHeight,
      'gridWidth' : gridWidth,
      'positionOffset': {
        x: -0.5 * rows * gridHeight,
        y: -0.5 * columns * gridWidth,
        z: -0.2
      },
      'positionCallback' : TileManagerService.positionCallbacks.water
    }).then(function (newTiles) {
      CellManagerService.water = [];
      for (var i = newTiles.length - 1; i >= 0; i--) {
        ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
        CellManagerService.water[i] = newTiles[i].tile.mesh;
      }
    });
  };
 
  $scope.addFoodSource = function () {
    FoodManagerService.createFoodSource();
  };

  $scope.shouldAddCellToRenderUpdates = true;
  $scope.addCell = function () {
    var worker = new Worker('js/workers/simpleCell.js');
    worker.addEventListener('message', $scope.cellListener);
    CellManagerService.createCell({
      worker:worker//,
      // invalidPlacement: function (a,b,c) {
      //   console.log('custom Invalid placement');
      //   $scope.cellListener({
      //     data:{
      //       cmd:'invalidPlacement',
      //       'a':a,
      //       'b':b,
      //       'c':c
      //     }
      //   });
      // }
    });
    if ($scope.shouldAddCellToRenderUpdates) {
      $scope.shouldAddCellToRenderUpdates = false;
      ThreeJSRendererService.onRenderFcts.push(CellManagerService.cell().update);
    }
  };

  $scope.cellListener = function (e) {
    var data = {};
    if (e.data !== undefined) {
      data = e.data;
    }
    if (data.cmd !== undefined) {
      switch (data.cmd) {
      case 'echo':
        console.log('echo: ', data.msg);
        break;
      case 'invalidPlacement':
        //positions!
        console.log('invalidPlacement');
        
        break;
      case 'move':
        //positions!
        CellManagerService.cell(data.cellId).move(data.position, data);
        break;
      default:
        $scope.messageCount += 1;
        break;
      }
    }
  };
  $scope.message = 0;

 
  /**
   * @doc function
   * @name survival.MainCtrl:createGameBoard
   *
   * @description adds stuff to the game board after the rest of the services are in place.
   *
   */
  $scope.createGameBoard = function () {
    $scope.addCell();
    $scope.addTilesToScene();
    // $scope.addFoodSource();
  };
  
  ThreeJSRendererService.doneFunctions.push($scope.createGameBoard);
  
  
  
});