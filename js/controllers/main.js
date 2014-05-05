angular.module('survivalApp')
	.controller('MainCtrl', function ($scope, $http, $interval, DEBUG, FoodManagerService, CellManagerService, DebugLessService, ThreeJSRendererService, TemplatesService, StringsService, KeyboardService, TileManagerService) {
	'use strict';
  
  
  $scope.DEBUG = DEBUG;
  $scope.showTools = false;
  $scope.movementVector = new THREE.Vector3(0, 0, 0);

  DebugLessService.init();
  
  TemplatesService.retrieve().$promise.then(function (data) {
    $scope.templates = data;
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
  $scope.toolManager = {
    show: function (toolName) {
      angular.forEach($scope.toolManager.tools, function (aTool, theToolsName) {
        if (theToolsName === toolName) {
          aTool.show = true;
        } else {
          aTool.show = false;
        }
      });
    },
    tools: {
      getTileAtCoord: {
        show: false,
        values: {
          'row': 0,
          'column': 0
        }
      },
      createTile: {
        show: false,
        values: {
          'row': 0,
          'column': 0
        }
      }
    }
  };

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
    $scope.smallPerlin = function (delta, time, tile) {
      // #### perlinCallback
      if (tile.seed === undefined) {
        tile.seed = Math.random();
      }
      // noise.simplex2 and noise.perlin2 return values between -1 and 1.
      var value =  noise.simplex3(tile.row / 20, tile.column / 20, tile.seed / 8);
      tile.mesh.position.z = value;
    };
    $scope.tms2.makeTileGrid({
      'rows' : 8,
      'columns' : 8,
      'positionCallback' : $scope.smallPerlin
    }).then(function (newTiles) {
      for (var i = newTiles.length - 1; i >= 0; i--) {
        ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
      }
    });
  };
 
  $scope.shouldAddFoodSourceToRenderUpdates = true;
  $scope.addFoodSource = function () {
    FoodManagerService.init();
    if ($scope.shouldAddFoodSourceToRenderUpdates) {
      $scope.shouldAddFoodSourceToRenderUpdates = false;
      ThreeJSRendererService.onRenderFcts.push(FoodManagerService.foodSource.update);
    }  
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
    
    worker.postMessage({
      'cmd': 'echo',
      'msg': 'Echo from MainCtrl to Cell to MainCtrl'
    }); // Send data to our worker.
    $interval(function () {
      worker.postMessage({
        'cmd': 'move'
      }); // Send data to our worker.
    }, 1000);
  };

 
  /**
   * @doc function
   * @name survival.MainCtrl:createGameBoard
   *
   * @description adds stuff to the game board after the rest of the services are in place.
   *
   */
  $scope.createGameBoard = function () {
    $scope.addCell();
  };
  
  ThreeJSRendererService.doneFunctions.push($scope.createGameBoard);
  
  
  $scope.toolManager.loadTiles = function () {
    if (typeof $scope.tileSets !== 'undefined') { 
      TileManagerService.loadTiles($scope.tileSets[0]);
    } else {
      console.log('No tiles to load');
    }
  };
  
});