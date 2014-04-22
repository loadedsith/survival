/*jshint white:false */
/* global angular:false, Detector:false, console:false */
var PI_2 = Math.PI / 2;
angular.module('survivalApp')
	.controller('MainCtrl', function ($scope, $http, DEBUG, ThreeJSRendererService, TemplatesService, StringsService, ThreeJSConfigService, KeyboardService, TileManagerService, FoodManagerService, CellManagerService) {
	'use strict';
  
  
  
  $scope.DEBUG = DEBUG;
  $scope.showTools = false;
  $scope.cameraMovement = {x:0,y:0,z:0};


  ThreeJSConfigService.retrieve().$promise.then(function (data) {
    $scope.config = data;
    ThreeJSRendererService.init();
  });
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

  $scope.lastDebugMsg = "";
  $scope.driveCamera = function (delta,time) {
    var camera = ThreeJSRendererService.camera,
    movement = new THREE.Vector3($scope.cameraMovement.x, $scope.cameraMovement.y, $scope.cameraMovement.z),
    deltaV = new THREE.Vector3(delta,delta,delta);

    movement.multiply(deltaV);
    camera.position.add(movement);    
    
    var foodMesh = FoodManagerService.foodSource.mesh;
    foodMesh.position.add(movement)
    
  };
  
  $scope.shouldAddCameraLoopFunction = true;
  $scope.$on('cameraMovement',function (event, attributes) {
    //Key binding is defined in the keyboad service, which emits this event
    $scope.cameraMovement = attributes;
    if($scope.shouldAddCameraLoopFunction){
      ThreeJSRendererService.onRenderFcts.push($scope.driveCamera);
      $scope.shouldAddCameraLoopFunction = false;
    }
  });
  

  $scope.shouldAddTilesToRenderUpdates = true;
  $scope.toolManager = {
    show: function (toolName){
      angular.forEach($scope.toolManager.tools, function(aTool, theToolsName){
        if(theToolsName === toolName){
          aTool.show = true;
        }else{
          aTool.show = false;
        }
      });
    },
    tools:{
      getTileAtCoord:{
        show:false,
        values:{
          "row":0,
          "column":0
        }
      },
      createTile:{
        show:false,
        values:{
          "row":0,
          "column":0
        }
      }
    }
  }

  $scope.addTilesToScene = function () {
    $scope.tms = TileManagerService;
    $scope.tms.makeTileGrid({
      'rows' : 8,
      'columns' : 8,
      'sewMesh':true
      }).then(function(newTiles){
        for (var i = newTiles.length - 1; i >= 0; i--) {
          console.log('ThreeJSRendererService', ThreeJSRendererService);
          ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
        }
    });
    
    
    $scope.tms2 = TileManagerService;
    $scope.doOnce = true;
    $scope.smallPerlin = function (delta, time, tile) {
      // #### perlinCallback
      if(tile.seed===undefined){
        tile.seed = Math.random();
      }
      // noise.simplex2 and noise.perlin2 return values between -1 and 1.
      var value =  noise.simplex3(tile.row / 20, tile.column / 20, tile.seed/8);
      tile.mesh.position.z = value;
    }
    $scope.tms2.makeTileGrid({
      "rows" : 8,
      "columns" : 8,
      "positionCallback" : $scope.smallPerlin
    }).then(function(newTiles){
      for (var i = newTiles.length - 1; i >= 0; i--) {
        ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
      }
    });
    console.log('TileManagerService', TileManagerService);


    if($scope.shouldAddTilesToRenderUpdates){
      console.log('ThreeJSRendererService', ThreeJSRendererService);
      ThreeJSRendererService.onRenderFcts.push(TileManagerService.updateTiles);
      $scope.shouldAddTilesToRenderUpdates=false;
    }
  };
 
  $scope.shouldAddFoodSourceToRenderUpdates = true;
  $scope.addFoodSource = function () {
    console.log('addFoodSource');
    FoodManagerService.init();
    if($scope.shouldAddFoodSourceToRenderUpdates){
      $scope.shouldAddFoodSourceToRenderUpdates=false;
      ThreeJSRendererService.onRenderFcts.push(FoodManagerService.foodSource.update);
    }  
  };
  
  $scope.shouldAddCellToRenderUpdates = true;
  $scope.addCell = function () {
    console.log('addCell');
    CellManagerService.init();
    if($scope.shouldAddCellToRenderUpdates){
      $scope.shouldAddCellToRenderUpdates=false;
      ThreeJSRendererService.onRenderFcts.push(CellManagerService.cell.update);
    }  
  };
  
  $scope.createGameBoard = function () {
    $scope.addTilesToScene();
    $scope.addFoodSource();
    $scope.addCell();
  };
  
  ThreeJSRendererService.ready($scope.createGameBoard);
  
  
  $scope.toolManager.loadTiles = function (){
    if(typeof $scope.tileSets !== "undefined"){      
      TileManagerService.loadTiles($scope.tileSets[0]);
    }else{          
      console.log('No tiles to load');
    }
  };
  
});