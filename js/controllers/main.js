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
    $scope.tms = TileManagerService;
    $scope.tms.makeTileGrid({
      'rows': 8,
      'columns': 8,
      'sewMesh': true
    }).then(function (newTiles) {
      for (var i = newTiles.length - 1; i >= 0; i--) {
        ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
      }
    });
    
    
    $scope.tms2 = TileManagerService;
    $scope.doOnce = true;
    $scope.tms2.makeTileGrid({
      'rows' : 16,
      'columns' : 16,
      'scale':{x: 0.1, y: 0.1, z: 0.1},
      'gridHeight' : 0.05,
      
      'positionCallback' : TileManagerService.positionCallbacks.water
    }).then(function (newTiles) {
      for (var i = newTiles.length - 1; i >= 0; i--) {
        ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
      }
    });
  };
 
  $scope.addFoodSource = function () {
    FoodManagerService.createFoodSource();
    
  };
  
  $scope.shouldAddCellToRenderUpdates = true;

  $scope.addCell = function () {
    CellManagerService.init();
    if ($scope.shouldAddCellToRenderUpdates) {
      $scope.shouldAddCellToRenderUpdates = false;
      ThreeJSRendererService.onRenderFcts.push(CellManagerService.cell().update);
    }
    $scope.createCellWebWorker();
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
  $scope.createCellWebWorker = function () {
    var worker = new Worker('js/workers/simpleCell.js');
    worker.addEventListener('message', $scope.cellListener);
    

  };

 
  /**
   * @doc function
   * @name survival.MainCtrl:createGameBoard
   *
   * @description adds stuff to the game board after the rest of the services are in place.
   *
   */
  $scope.createGameBoard = function () {
    // $scope.addCell();
    $scope.addTilesToScene();
    // $scope.addFoodSource();
  };
  
  ThreeJSRendererService.doneFunctions.push($scope.createGameBoard);
  
  
  
});