/*jshint white:false */
/* global angular:false, Detector:false, console:false */
var PI_2 = Math.PI / 2;
angular.module('survivalApp')
	.controller('MainCtrl', function ($scope, $http, TemplatesService, StringsService, ThreeJSConfigService, KeyboardService, TileManagerService) {
	'use strict';
  $scope.showTools = false;
  $scope.cameraMovement = {x:0,y:0,z:0};
  $scope.driveCamera = function (delta,time) {
    $scope.camera.position.x = $scope.camera.position.x + $scope.cameraMovement.x * delta; 
    $scope.camera.position.y = $scope.camera.position.y + $scope.cameraMovement.y * delta; 
    $scope.camera.position.z = $scope.camera.position.z + $scope.cameraMovement.z * delta; 
  };
  $scope.shouldAddCameraLoopFunction = true;
  $scope.cameraLoopInit = function () {
    if($scope.shouldAddCameraLoopFunction){
      $scope.onRenderFcts.push($scope.driveCamera);
      $scope.shouldAddCameraLoopFunction = false;
    }  
  };
  
  ThreeJSConfigService.retrieve().$promise.then(function (data) {
    $scope.config = data;
    $scope.init();
  });
  TemplatesService.retrieve().$promise.then(function (data) {
    $scope.templates = data;
  });
  StringsService.retrieve().$promise.then(function (data) {
    $scope.strings = data;
  });
  $scope.$on('cameraMovement',function (event, attributes) {
    console.log('Indigo Greenish Grass-dart frog',event, attributes);
    $scope.cameraMovement = attributes;
    $scope.cameraLoopInit();
  })
  $scope.noiseSeed = noise.seed(Math.random());
  KeyboardService.setScope($scope);
  $scope.keyUp = KeyboardService.keyUp;
  $scope.keyDown = KeyboardService.keyDown;
  $scope.doOnce = true;

  $scope.shouldAddedValueFunction = true;
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

  $scope.toolManager.loadTiles = function (){
    if(typeof $scope.tileSets !== "undefined"){      
      TileManagerService.loadTiles($scope.tileSets[0]);
    }else{          
      console.log('No tiles to load');
    }
  };
  
  
  $scope.init = function () {
    console.log('MainCtrl Init');
    if( !Detector.webgl ){
      Detector.addGetWebGLMessage();
      $scope.noWebGl = $scope.config.noWebGl;
      throw $scope.config.noWebGl;
    }
  	var renderer	= new THREE.WebGLRenderer();
  	renderer.setSize( window.innerWidth, window.innerHeight );
  	$('#renderer').empty().append( renderer.domElement );
  	// setup a scene and camera
  	$scope.scene	= new THREE.Scene();
  	$scope.camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight*.8, 0.01, 1000);
  	$scope.camera.position.z = 4;
  	// declare the rendering loop
  	$scope.onRenderFcts= [];

  	// handle window resize events
  	var winResize	= new THREEx.WindowResize(renderer, $scope.camera)

  	//////////////////////////////////////////////////////////////////////////////////
  	//		default 3 points lightning					//
  	//////////////////////////////////////////////////////////////////////////////////
	
  	var ambientLight= new THREE.AmbientLight( 0x020202 )
  	$scope.scene.add( ambientLight)
  	var frontLight	= new THREE.DirectionalLight('white', 1)
  	frontLight.position.set(0.5, 0.5, 2)
  	$scope.scene.add( frontLight )
  	var backLight	= new THREE.DirectionalLight('white', 0.75)
  	backLight.position.set(-0.5, -0.5, -2)
  	$scope.scene.add( backLight )		

    TileManagerService.makeTileGrid(8,8).then(function(newTiles){
      for (var i = newTiles.length - 1; i >= 0; i--) {
        $scope.scene.add(newTiles[i].tile.mesh);
      }
    });

  
    if($scope.shouldAddedValueFunction){
      $scope.onRenderFcts.push(TileManagerService.updateTiles);
      $scope.shouldAddedValueFunction=false;
    }
  
  	//////////////////////////////////////////////////////////////////////////////////
  	//		Camera Controls							//
  	//////////////////////////////////////////////////////////////////////////////////
  	var mouse	= {x : 0, y : 0, down:false}

  	document.addEventListener('mousemove', function(event){
  		mouse.x	= (event.clientX / window.innerWidth ) - 0.5
  		mouse.y	= (event.clientY / window.innerHeight) - 0.5

  	}, false)
  	$scope.camera.rotation.set( 0, 0, 0 );
  
    
    $scope.onRenderFcts.push(function(delta, now){


      // $scope.yawObject.rotation.y -= mouse.x * 0.002;
      if(mouse.down){
        $scope.camera.rotation.x -= mouse.y * 0.02;
        $scope.camera.rotation.x = Math.max( - PI_2, Math.min( PI_2, $scope.camera.rotation.x ) );
        $scope.camera.rotation.y -= mouse.x * 0.02;
        $scope.camera.rotation.y = Math.max( - PI_2, Math.min( PI_2, $scope.camera.rotation.y ) );
      }


    })

  	//////////////////////////////////////////////////////////////////////////////////
  	//		render the scene						//
  	//////////////////////////////////////////////////////////////////////////////////
  	$scope.onRenderFcts.push(function(){
  		renderer.render( $scope.scene, $scope.camera );		
  	})
	
  	//////////////////////////////////////////////////////////////////////////////////
  	//		Rendering Loop runner						//
  	//////////////////////////////////////////////////////////////////////////////////
  	var lastTimeMsec= null
  	requestAnimationFrame(function animate(nowMsec){
  		// keep looping
  		requestAnimationFrame( animate );
  		// measure time
  		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
  		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
  		lastTimeMsec	= nowMsec
  		// call each update function
  		$scope.onRenderFcts.forEach(function(onRenderFct){
  			onRenderFct(deltaMsec/1000, nowMsec/1000)
  		})
  	})
  };

  
});