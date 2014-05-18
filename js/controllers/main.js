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
  
  
  $scope.keyboardMovement = function (delta) {
    // console.log('driveThis.type', $scope.driveThis.type);
    var movement = new THREE.Vector3($scope.movementVector.y, $scope.movementVector.x, $scope.movementVector.z),
    deltaV = new THREE.Vector3(delta, delta, delta);
    movement.multiply(deltaV);
    // DebugLessService.msg = ['keyboardMovement', movement];

    switch ($scope.driveThis) {
    case 'camera':
      var camera = ThreeJSRendererService.camera;
      camera.position.x = camera.position.x + movement.y;
      camera.position.y = camera.position.y - movement.z;
      camera.position.z = camera.position.z + movement.x;
      // camera.position.add(movement);
      break;
    case 'food':
      var foodMesh = FoodManagerService.foodSources[0].mesh;
      foodMesh.position.x = foodMesh.position.x + movement.y;
      foodMesh.position.y = foodMesh.position.y - movement.z;
      foodMesh.position.z = foodMesh.position.z + movement.x;
      break;
    case 'cell':
      var cellPos = new THREE.Vector3();
      cellPos.copy(CellManagerService.cells[0].mesh.position);

      cellPos.x = cellPos.x + movement.y;
      cellPos.y = cellPos.y - movement.z;
      cellPos.z = cellPos.z + movement.x;
      CellManagerService.cell(0).move([cellPos.x,cellPos.y,cellPos.z], {position:[cellPos.x,cellPos.y,cellPos.z]});
      break;
    default:
      camera.position.add(movement);    
      break;
    }
  };
  
  $scope.$on('updateKeyboardBinding', function (event, attributes) {
    $scope.driveThis = attributes;
  });
  
  $scope.$on('updateWorker', function (event, attributes) {
    console.log('yellow antelope');

    $scope.workerBlob = new Blob([attributes]);
    console.log('attributes', attributes);
    var blobURL = window.URL.createObjectURL($scope.workerBlob);
    if ($scope.worker !== undefined) {
      $scope.worker.terminate();
    }
    $scope.worker = new Worker(blobURL);
    $scope.worker.addEventListener('message', $scope.cellListener);
    // $scope.worker = attributes;
  });
    
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
    var rows = 25,
        columns = 20,
        scale = 0.125,
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
        x: -0.4 * rows * gridHeight,
        y: -0.65 * columns * gridWidth,
        z: 0
      },
      'positionCallback' : TileManagerService.positionCallbacks.land
    }).then(function (newTiles) {
      TileManagerService.land = [];
      for (var i = newTiles.length - 1; i >= 0; i--) {
        TileManagerService.land[i] = newTiles[i].tile.mesh;
        TileManagerService.land[i].tileType = 'land';
        ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
      }
    });
    
    
    $scope.water = TileManagerService;
    $scope.doOnce = true;
    $scope.water.makeTileGrid({
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
        x: -0.4 * rows * gridHeight,
        y: -0.65 * columns * gridWidth,
        z: -0.15
      },
      'positionCallback' : TileManagerService.positionCallbacks.water
    }).then(function (newTiles) {
      TileManagerService.water = [];
      for (var i = newTiles.length - 1; i >= 0; i--) {
        TileManagerService.water[i] = newTiles[i].tile.mesh;
        TileManagerService.water[i].tileType = 'water';
        ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
      }
    });
  };
 
  $scope.addFoodSource = function () {
    CellManagerService.foodSource = FoodManagerService.createFoodSource();
  };

  $scope.shouldAddCellToRenderUpdates = true;
  
  $scope.addCell = function () {

    
    var newCell = CellManagerService.createCell({
      workerBlobText:$scope.workerBlobText//,
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

  
  $scope.message = 0;

 
  /**
   * @doc function
   * @name survival.MainCtrl:createGameBoard
   *
   * @description adds stuff to the game board after the rest of the services are in place.
   *
   */
  $scope.createGameBoard = function () {
    $http({method: 'GET', url: 'js/workers/simpleCell.js'}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.workerBlobText = data;
        $scope.addCell();
        $scope.addCell();
        $scope.addCell();
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log('failed to get Worker');
      });

    $scope.addTilesToScene();
    $scope.addFoodSource();
  };
  
  ThreeJSRendererService.doneFunctions.push($scope.createGameBoard);
  
  
  
});