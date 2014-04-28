angular.module('survivalApp')
  .service('FoodManagerService', function (ThreeJSRendererService) {//$interval, $timeout
    'use strict';
    
    var foodManager = this;
    foodManager.foodSource = {
      update: function (delta, time) {
        foodManager.foodSource.mesh.rotateX(Math.cos(time) * delta);
      }
    };
    foodManager.init = function () {
      var radius = 0.3;
      var geometry = new THREE.CubeGeometry(0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10);
                                                               
      foodManager.foodSource.texture = THREE.ImageUtils.loadTexture('textures/foodSource.png');
      foodManager.foodSource.texture.anisotropy = ThreeJSRendererService.renderer.getMaxAnisotropy();

      var material = new THREE.MeshBasicMaterial({ map: foodManager.foodSource.texture});

      // var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });

      foodManager.foodSource.mesh = new THREE.Mesh(geometry, material); 

      ThreeJSRendererService.scene.add(foodManager.foodSource.mesh);

      foodManager.foodSource.mesh.position = new THREE.Vector3(-0.57, 0.52, 0.7);

    };

  });