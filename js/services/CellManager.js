angular.module('survivalApp')
  .service('CellManagerService', function (ThreeJSRendererService, DebugLessService) {//$interval, $timeout
    'use strict';
    var cellManager = this;
    cellManager.cells = [];
    cellManager.createCell = function (options) {
      var settings = options ? options : {};
      var cellId = settings.id ? settings.id : cellManager.cells.length ;
      
      var radius = 0.3;
      
      var geometry = new THREE.CubeGeometry(0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10);
                                                             
      var material = new THREE.MeshPhongMaterial({
        ambient: 0x030303,
        color: 0xdddddd,
        specular: 0x009900,
        shininess: 30
      });
      
      cellManager.cells[cellId] = {};
      
      cellManager.cells[cellId].mesh = new THREE.Mesh(geometry, material); 

      ThreeJSRendererService.scene.add(cellManager.cells[cellId].mesh);

      cellManager.cells[cellId].mesh.position = new THREE.Vector3(-0.57, 0.52, 0.7);

      
    };
    
    cellManager.cell = function (cellId) {
      if (cellId === undefined) {
        cellId = 0; 
      }
      if (cellManager.cells[cellId] === undefined) {
        cellManager.createCell({id:cellId});
      }
      return {
        move: function (position, data) {
          console.log('cellManager.cells[cellId].mesh.position', cellManager.cells[cellId].mesh.position);
          cellManager.cells[cellId].mesh.position.x = data.position[0];
          cellManager.cells[cellId].mesh.position.y = data.position[1];
          cellManager.cells[cellId].mesh.position.z = data.position[2];
          // console.log('move: CellId', cellId);
          // console.log('data', data);
        },
        update : function (delta, time) {
          // DebugLessService.msg = cellManager;
          cellManager.cells[cellId].mesh.rotateX(Math.sin(time) * delta);
        },
        mesh : function () {
          return cellManager.cells[cellId].mesh;
        }
      }; 
    };
    cellManager.init = function () {
      cellManager.createCell();
    };
  });