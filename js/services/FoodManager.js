angular.module('survivalApp')
  .service('FoodManagerService', function (DEBUG, DebugLessService, ThreeJSRendererService) {//$interval, $timeout
    'use strict';
    
    var foodManager = this;
    var update = function (delta, time, foodSource) {
      foodSource.mesh.rotateX(Math.cos(time) * delta);
    };
    
    var defaultTexture = THREE.ImageUtils.loadTexture('textures/foodSource.png');
    
    var materials = {
      'phong' : new THREE.MeshPhongMaterial({ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading}),
      'basic' : new THREE.MeshBasicMaterial({map: defaultTexture})
    };

    foodManager.foodSources = [];
    foodManager.update = function (delta, time) {
      for (var i = foodManager.foodSources.length - 1; i >= 0; i--) {
        update(delta, time, foodManager.foodSources[i]);
      }
    };
    foodManager.shouldAddFoodSourceToRenderUpdates = true;
    foodManager.createFoodSource = function (config) {
      if (config === undefined) {
        config = {};
      }
      
      //Set or overwrite the food source with that id

      var newFoodSource = {};
      newFoodSource.id = config.id || foodManager.foodSources.length;
      newFoodSource.radius = config.radius || 0.3;
      newFoodSource.geometry =  new THREE.CubeGeometry(0.8 * newFoodSource.radius, 0.8 * newFoodSource.radius, 0.8 * newFoodSource.radius, 10, 10, 10);;
      newFoodSource.material = config.material || materials.basic;;
      newFoodSource.mesh = new THREE.Mesh(newFoodSource.geometry, newFoodSource.material); 

      newFoodSource.texture = config.texture || defaultTexture;;
      newFoodSource.texture.anisotropy = ThreeJSRendererService.renderer.getMaxAnisotropy();      
      ThreeJSRendererService.scene.add(newFoodSource.mesh);
      newFoodSource.mesh.position =  config.position || new THREE.Vector3(-0.57, 0.52, 0.3);;

      var index = foodManager.foodSources.length;
      foodManager.foodSources.push(newFoodSource);
      
      ThreeJSRendererService.scene.add(foodManager.foodSources[index].mesh);
      
      foodManager.foodSources[index].mesh.position = new THREE.Vector3(-0.57, 0.52, 0.3);

      
      if (foodManager.shouldAddFoodSourceToRenderUpdates) {
        foodManager.shouldAddFoodSourceToRenderUpdates = false;
        ThreeJSRendererService.onRenderFcts.push(foodManager.update);
      }
      return newFoodSource;
    };
    

  });