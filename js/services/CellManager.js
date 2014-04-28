angular.module('survivalApp')
  .service('CellManagerService', function (ThreeJSRendererService) {//$interval, $timeout
    'use strict';
    var cellManager = this;
    cellManager.cell = {
      update : function (delta, time) {
        cellManager.cell.mesh.rotateX(Math.sin(time) * delta);
      }
    };
    cellManager.init = function () {
      var radius = 0.3;
      var geometry = new THREE.CubeGeometry(0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10);
                                                             
      var material = new THREE.MeshPhongMaterial({
        ambient: 0x030303,
        color: 0xdddddd,
        specular: 0x009900,
        shininess: 30
      });

      cellManager.cell.mesh = new THREE.Mesh(geometry, material); 

      ThreeJSRendererService.scene.add(cellManager.cell.mesh);

      cellManager.cell.mesh.position = new THREE.Vector3(-0.57, 0.52, 0.7);

    };

  });