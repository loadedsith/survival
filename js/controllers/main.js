/*jshint white:false */
/* global angular:false, Detector:false, console:false */
var PI_2 = Math.PI / 2;
angular.module('survivalApp')
	.controller('MainCtrl', function ($scope, $http, DEBUG, ThreeJSRendererService, TemplatesService, StringsService, ThreeJSConfigService, KeyboardService, TileManagerService) {
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

  $scope.driveCamera = function (delta,time) {
    // ThreeJSRendererService.camera.position.x = ThreeJSRendererService.camera.position.x + $scope.cameraMovement.x * delta; 
    // ThreeJSRendererService.camera.position.y = ThreeJSRendererService.camera.position.y + $scope.cameraMovement.y * delta; 
    // ThreeJSRendererService.camera.position.z = ThreeJSRendererService.camera.position.z + $scope.cameraMovement.z * delta; 

    $scope.foodSource.mesh.position.x = $scope.foodSource.mesh.position.x + $scope.cameraMovement.x * delta; 
    $scope.foodSource.mesh.position.y = $scope.foodSource.mesh.position.y + $scope.cameraMovement.y * delta; 
    $scope.foodSource.mesh.position.z = $scope.foodSource.mesh.position.z + $scope.cameraMovement.z * delta; 
    var position = $scope.foodSource.mesh.position;
    console.log('position.x,position.y,position.z', position.x,position.y,position.z);
    
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
  $scope.foodSource = {
    update : function (delta, time) {
      $scope.foodSource.mesh.rotateX(Math.cos(time)*delta);
    }
  };
  
  $scope.shouldAddFoodSourceToRenderUpdates = true;
  $scope.addFoodSource = function () {
    console.log('addFoodSource');
    console.log('THREE', THREE);
    var radius = 0.3;
    var geometry = new THREE.CubeGeometry(0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10);

    var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });

		$scope.foodSource.mesh = new THREE.Mesh( geometry, material ); 

    $scope.foodSource.mesh.geometry.positionX = -0.57;
    $scope.foodSource.mesh.geometry.positionY = 0.52 ;
    $scope.foodSource.mesh.geometry.positionZ = 0.4;

		ThreeJSRendererService.scene.add( $scope.foodSource.mesh );

    if($scope.shouldAddFoodSourceToRenderUpdates){
      $scope.shouldAddFoodSourceToRenderUpdates=false;
      ThreeJSRendererService.onRenderFcts.push($scope.foodSource.update);
    }  
  };
  $scope.createGameBoard = function () {
    $scope.addTilesToScene();
    $scope.addFoodSource();
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