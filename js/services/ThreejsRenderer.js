angular.module('survivalApp')
  .service('ThreeJSRendererService', function ($timeout) {//$interval, 
    var threeJSRender = this;
    
    threeJSRender.ready = function (callback) {
      console.log('Red Yellow-banded Dart frog');
      if(typeof callback === 'function'){
        $timeout(function () {
          callback();
        },1000);
      }
    }
    threeJSRender.init = function () {

      // if( !Detector.webgl ){
  //       Detector.addGetWebGLMessage();
  //       $scope.noWebGl = $scope.config.noWebGl;
  //       throw $scope.config.noWebGl;
  //     }
    	threeJSRender.renderer	= new THREE.WebGLRenderer();
    	threeJSRender.renderer.setSize( window.innerWidth, window.innerHeight );
    	$('#renderer').empty().append( threeJSRender.renderer.domElement );
    	// setup a scene and camera
    	threeJSRender.scene	= new THREE.Scene();
    	threeJSRender.camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight*.8, 0.01, 1000);
    	threeJSRender.camera.position.z = 4;
    	// declare the rendering loop
    	threeJSRender.onRenderFcts= [];

    	// handle window resize events
    	threeJSRender.winResize	= new THREEx.WindowResize(threeJSRender.renderer, threeJSRender.camera)

    	//////////////////////////////////////////////////////////////////////////////////
    	//		default 3 points lightning					//
    	//////////////////////////////////////////////////////////////////////////////////
    
      threeJSRender.lights={};
      
    	threeJSRender.lights.ambientLight= new THREE.AmbientLight( 0x020202 );
    	threeJSRender.scene.add( threeJSRender.lights.ambientLight);
      
    	threeJSRender.lights.frontLight	= new THREE.DirectionalLight('white', 1)
    	threeJSRender.lights.frontLight.position.set(0.5, 0.5, 2);
    	threeJSRender.scene.add( threeJSRender.lights.frontLight );
    	threeJSRender.lights.backLight	= new THREE.DirectionalLight('white', 0.75);
    	threeJSRender.lights.backLight.position.set(-0.5, -0.5, -2)
    	threeJSRender.scene.add( threeJSRender.lights.backLight )		

    
    
    	//////////////////////////////////////////////////////////////////////////////////
    	//		Camera Controls							//
    	//////////////////////////////////////////////////////////////////////////////////

    	threeJSRender.mouse	= {x : 0, y : 0, down:false}

    	document.addEventListener('mousemove', function(event){
    		threeJSRender.mouse.x	= (event.clientX / window.innerWidth ) - 0.5
    		threeJSRender.mouse.y	= (event.clientY / window.innerHeight) - 0.5

    	}, false);
      
    	threeJSRender.camera.rotation.set( 0, 0, 0 );
  
    
      threeJSRender.onRenderFcts.push(function(delta, now){


        // $scope.yawObject.rotation.y -= mouse.x * 0.002;
        if(threeJSRender.mouse.down){
          $scope.camera.rotation.x -= mouse.y * 0.02;
          $scope.camera.rotation.x = Math.max( - PI_2, Math.min( PI_2, $scope.camera.rotation.x ) );
          $scope.camera.rotation.y -= mouse.x * 0.02;
          $scope.camera.rotation.y = Math.max( - PI_2, Math.min( PI_2, $scope.camera.rotation.y ) );
        }


      });

    	//////////////////////////////////////////////////////////////////////////////////
    	//		render the scene						//
    	//////////////////////////////////////////////////////////////////////////////////
    	threeJSRender.onRenderFcts.push(function(){
    		threeJSRender.renderer.render( threeJSRender.scene, threeJSRender.camera );		
    	});
	
    	//////////////////////////////////////////////////////////////////////////////////
    	//		Rendering Loop runner						//
    	//////////////////////////////////////////////////////////////////////////////////
    	threeJSRender.lastTimeMsec= null;
    	requestAnimationFrame(function animate(nowMsec){
    		// keep looping
    		requestAnimationFrame( animate );
    		// measure time
    		threeJSRender.lastTimeMsec	= threeJSRender.lastTimeMsec || nowMsec-1000/60
    		var deltaMsec	= Math.min(200, nowMsec - threeJSRender.lastTimeMsec)
    		threeJSRender.lastTimeMsec	= nowMsec
    		// call each update function
    		threeJSRender.onRenderFcts.forEach(function(onRenderFct){
    			onRenderFct(deltaMsec/1000, nowMsec/1000)
    		})
    	});
      threeJSRender.ready();
    }
  });
