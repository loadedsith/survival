angular.module('survivalApp')
	.controller('MainCtrl', function ($scope, $http, $interval,
                                    DEBUG, FoodManagerService, CellManagerService,
                                    DebugLessService, ThreeJSRendererService, TemplatesService,
                                    StringsService, KeyboardService, TileManagerService, LevelManagerService
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
    // DebugLessService.message = ['keyboardMovement', movement];

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
      CellManagerService.cell(0).move({x: cellPos.x, y: cellPos.y, z: cellPos.z}, {position:{x: cellPos.x, y: cellPos.y, z: cellPos.z}});
      break;
    case 'disabled':
      // console.log('drive nothing');
      break;
    default:
      camera.position.add(movement);    
      break;
    }
  };
  
  $scope.$on('updateKeyboardBinding', function (event, attributes) {
    $scope.driveThis = attributes;
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
   

  $scope.shouldAddCellToRenderUpdates = true;
  
  
  $scope.message = 0;

 
  /**
   * @doc function
   * @name survival.MainCtrl:createGameBoard
   *
   * @description adds stuff to the game board after the rest of the services are in place.
   *
   */
  $scope.createGameBoard = function () {
 
    LevelManagerService.createLevel(0);

  };
  
  ThreeJSRendererService.doneFunctions.push($scope.createGameBoard);
  
  
  
});