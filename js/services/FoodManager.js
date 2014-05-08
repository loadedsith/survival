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
      var id = config.id ? config.id : foodManager.foodSources.length;
      var radius = config.radius ? config.radius : 0.3;
      var geometry = new THREE.CubeGeometry(0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10);
      var texture = config.texture ? config.texture : defaultTexture;
      var material = config.material ? config.material : materials.basic;
      var position = config.position ? config.position : new THREE.Vector3(-0.57, 0.52, 0.7);
      
      //Set or overwrite the food source with that id
      var index = foodManager.foodSources.length;
      foodManager.foodSources.push({});
      foodManager.foodSources[index].mesh = new THREE.Mesh(geometry, material); 

      foodManager.foodSources[index].id = id;
      foodManager.foodSources[index].texture = texture;
      foodManager.foodSources[index].texture.anisotropy = ThreeJSRendererService.renderer.getMaxAnisotropy();      
      ThreeJSRendererService.scene.add(foodManager.foodSources[0].mesh);
      foodManager.foodSources[index].mesh.position =  position;

      ThreeJSRendererService.scene.add(foodManager.foodSources[index]);
      
      foodManager.foodSources[index].mesh.position = position;
      foodManager.foodSources[index].mesh.position = new THREE.Vector3(-0.57, 0.52, 0.7);
      if (foodManager.shouldAddFoodSourceToRenderUpdates) {
        foodManager.shouldAddFoodSourceToRenderUpdates = false;
        ThreeJSRendererService.onRenderFcts.push(foodManager.update);
      }
    };
    

  });