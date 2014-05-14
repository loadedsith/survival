/*global Detector: false, THREEx: false, requestAnimationFrame: false */


angular.module('survivalApp')
  .service('ThreeJSRendererService', function (ThreeJSConfigService) {//$timeout, $interval, 
    'use strict'; 
    /**
     * @doc overview
     * @name survival.moduleSection:ThreeJSConfigService
     *
     * @description This function rules!
     *
     */ 

 
    var threeJSRender = this;
    threeJSRender.gameboard = {
     max: {
       x: 0,
       y: 0,
       z: 0
     },
     min: {
       x: 0,
       y: 0,
       z: 0
     }
    }
    ThreeJSConfigService.retrieve().$promise.then(function (data) {
      threeJSRender.config = data;
      threeJSRender.init();
    });
    
    threeJSRender.doneFunctions = [];
    threeJSRender.init = function () {
      if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        throw threeJSRender.config.noWebGl;
      }
      
      threeJSRender.renderer = new THREE.WebGLRenderer();
      threeJSRender.renderer.setSize(window.innerWidth, window.innerHeight);
      $('#renderer').empty().append(threeJSRender.renderer.domElement);
      // setup a scene and camera
      threeJSRender.scene = new THREE.Scene();
      threeJSRender.camera  = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight * 0.8, 0.01, 1000);
      threeJSRender.camera.position.z = 4;
      // declare the rendering loop
      threeJSRender.onRenderFcts = [];

      // handle window resize events
      threeJSRender.winResize = new THREEx.WindowResize(threeJSRender.renderer, threeJSRender.camera);

      //////////////////////////////////////////////////////////////////////////////////
      //    default 3 points lightning          //
      //////////////////////////////////////////////////////////////////////////////////
    
      threeJSRender.lights = {};
      
      threeJSRender.lights.ambientLight = new THREE.AmbientLight(0x020202);
      threeJSRender.scene.add(threeJSRender.lights.ambientLight);
      
      threeJSRender.lights.frontLight = new THREE.DirectionalLight('white', 1);
      threeJSRender.lights.frontLight.position.set(0.5, 0.5, 2);
      threeJSRender.scene.add(threeJSRender.lights.frontLight);
      
      threeJSRender.lights.backLight = new THREE.DirectionalLight('white', 0.75);
      threeJSRender.lights.backLight.position.set(-0.5, -0.5, -2);
      threeJSRender.scene.add(threeJSRender.lights.backLight);

    
    
      //////////////////////////////////////////////////////////////////////////////////
      //    Camera Controls             //
      //////////////////////////////////////////////////////////////////////////////////

      threeJSRender.mouse = {x: 0, y: 0, down: false};

      document.addEventListener('mousemove', function (event) {
        threeJSRender.mouse.x = (event.clientX / window.innerWidth) - 0.5;
        threeJSRender.mouse.y = (event.clientY / window.innerHeight) - 0.5;

      }, false);
      
      threeJSRender.camera.rotation.set(0, 0, 0);

      //////////////////////////////////////////////////////////////////////////////////
      //    render the scene            //
      //////////////////////////////////////////////////////////////////////////////////
      threeJSRender.onRenderFcts.push(function () {
        threeJSRender.renderer.render(threeJSRender.scene, threeJSRender.camera);
      });
  
      //////////////////////////////////////////////////////////////////////////////////
      //    Rendering Loop runner           //
      //////////////////////////////////////////////////////////////////////////////////
      threeJSRender.lastTimeMsec = null;
      requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        threeJSRender.lastTimeMsec = threeJSRender.lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(200, nowMsec - threeJSRender.lastTimeMsec);
        threeJSRender.lastTimeMsec = nowMsec;
        // call each update function
        threeJSRender.onRenderFcts.forEach(function (onRenderFct) {
          if (typeof onRenderFct === 'function') {
            onRenderFct(deltaMsec / 1000, nowMsec / 1000);
          } else {
            throw new Error('onRenderFct function is not a function: ', onRenderFct);
          }
          
        });
      });
      for (var i = threeJSRender.doneFunctions.length - 1; i >= 0; i--) {
        var funct = threeJSRender.doneFunctions[i];
        if (typeof funct === 'function') {
          funct();
        }
      }
    };
  });
