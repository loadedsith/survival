angular.module('survivalApp')
  .service('CellManagerService', function (ThreeJSRendererService, FoodManagerService, DebugLessService, TileManagerService) {//$interval, $timeout
    'use strict';
    var cellManager = this;
    cellManager.cells = [];
    cellManager.createCell = function (options) {
      var settings = options ? options : {};
      var cellId = settings.id ? settings.id : cellManager.cells.length;
      
      var radius = 0.3;
      
      var geometry = new THREE.CubeGeometry(0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10);
                                                             
      var material = new THREE.MeshPhongMaterial({
        ambient: 0x030303,
        color: 0xdddddd,
        specular: 0x009900,
        shininess: 30
      });
      
      cellManager.cells[cellId] = {
        id:cellId,
        invalidPlacement: settings.invalidPlacement || function (event) {
          // console.log('invalidCell placement: ', this, event);
          this.worker.postMessage({
            cmd:event.cmd,
            message:event.message,
            position:event.position
          });
        }
      };
      
      cellManager.cells[cellId].worker = settings.worker;
       
      cellManager.cells[cellId].mesh = new THREE.Mesh(geometry, material); 

      ThreeJSRendererService.scene.add(cellManager.cells[cellId].mesh);

      

      cellManager.cells[cellId].mesh.position = new THREE.Vector3(-0.57, 0.52, 0.7);
      cellManager.cells[cellId].raycaster = new THREE.Raycaster();
      
    };
    cellManager.moveCell = function (cellId, position, data) {
      // console.log('cellId,position,data', cellId,position,data);
      /**
       * @ngdoc moveCell
       * @name survival.CellManager:moveCell
       * 
       * @description #Move cell
        Moves the cell, using the cellId or chained from cell(cellId) and a position.
      If the move is invalid it calls the cells.invalidPlacement function, which can be assigned to using the constructor or after the fact
       */
      var cell = cellManager.cells[cellId];
      var newPos = new THREE.Vector3(position[0] || 0, position[1] || 0, position[2] || 0);
      var cellPos = cell.mesh.position;
      
      //we start by making a copy of the cell's position
      var orignialCellPos = new THREE.Vector3(0,0,0).copy(cellPos);
            
      if (TileManagerService.land === undefined) {
        console.log('landNotDefined', landNotDefined);
        cellPos.x = data.position[0];
        cellPos.y = data.position[1];
        cellPos.z = data.position[2];
      }else{
        //wheres the nearest land?
        //Temp move the cell to the new position
        cellPos.x = data.position[0];
        cellPos.y = data.position[1];
        cellPos.z = data.position[2];
        //get the nearest land and water for the new position
        
        //check for valid placement, is it on the gameboard?
        if (cellPos.x < ThreeJSRendererService.gameboard.min.x || cellPos.x > ThreeJSRendererService.gameboard.max.x) {
          cell.invalidPlacement({cmd:'invalidPlacement','message':'Invalid Placement: offgamebroad x:' + cellPos.x +'< ThreeJSRendererService.gameboard.min.x || ' + cellPos.x + ' > ThreeJSRendererService.gameboard.max.x', 'position':orignialCellPos, 'cell':cell});
          cellPos.copy(orignialCellPos);
          return;
        }
        if (cellPos.y < ThreeJSRendererService.gameboard.min.y || cellPos.y > ThreeJSRendererService.gameboard.max.y) {
          cell.invalidPlacement({cmd:'invalidPlacement','message':'Invalid Placement: offgamebroad y:' + cellPos.y +'< ThreeJSRendererService.gameboard.min.y ||' + cellPos.y + ' > ThreeJSRendererService.gameboard.max.y', 'position':orignialCellPos, 'cell':cell});
          cellPos.copy(orignialCellPos);
          return;
        }

        var down = new THREE.Vector3(0, 0, 1);

        var rays = [
              {name:'up', vector:new THREE.Vector3(0, 0, 1)},
              {name:'upRight', vector:new THREE.Vector3(1, 0, 1)},
              {name:'right', vector:new THREE.Vector3(1, 0, 0)},
              {name:'downRight', vector:new THREE.Vector3(1, 0, -1)},
              {name:'down', vector:new THREE.Vector3(0, 0, -1)},
              {name:'downLeft', vector:new THREE.Vector3(-1, 0, -1)},
              {name:'left', vector:new THREE.Vector3(-1, 0, 0)},
              {name:'upLeft', vector:new THREE.Vector3(-1, 0, 1)}
            ];
        for (var i = 0; i < rays.length; i += 1) {
          var newPos = new THREE.Vector3().copy(cellManager.cells[cellId].mesh.position);
          
          cellManager.cells[cellId].raycaster.set(newPos, rays[i].vector, 0, Math.Infinite);
   
          var intersectionsFoodSources = cellManager.cells[cellId].raycaster.intersectObjects( [FoodManagerService.foodSources[0].mesh] );
          
          if (intersectionsFoodSources.length !== 0) {
            cellManager.cells[cellId].nearestFoodSource = {};
            // console.log('intersectionsFoodSources ' + rays[i].name + " @ " + Math.ceil(intersectionsFoodSources[0].distance * 100) / 100 );
            cellManager.cells[cellId].nearestFoodSource[rays[i].name] = Math.ceil(intersectionsFoodSources[0].distance * 100) / 100;
          }
          DebugLessService.msg = angular.toJson(cellManager.cells[cellId].nearestFoodSource||{});

          
          newPos.add(rays[0].vector);
          newPos.add(rays[0].vector);

          
          cellManager.cells[cellId].raycaster.set(newPos, rays[i].vector);
          
          // console.log('cellManager.cells[cellId].raycaster', cellManager.cells[cellId].raycaster);

          var intersectionsLand  = cellManager.cells[cellId].raycaster.intersectObjects(TileManagerService.land );
          var intersectionsWater = cellManager.cells[cellId].raycaster.intersectObjects(TileManagerService.water);

          // console.log('intersectionsWater.length intersectionsLand.length ', intersectionsWater.length, intersectionsLand.length  );
          if (intersectionsWater.length === 1 && intersectionsLand.length === 1 ) {
            //move on the down array, where we detect a land and a water
            // Yep, this.rays[i].vector gives us : 0 => up, 1 => up-left, 2 => left, ...

            if (intersectionsLand[0].distance < intersectionsWater[0].distance) {
              //landFirst

              cell.lastMove = 'valid';
              // TODO: cell.worker.postMessage({cmd:'lastMove',msg:'valid'})?
              cellPos.x = data.position[0];
              cellPos.y = data.position[1];
              cellPos.z = intersectionsLand[0].object.position.z + 0.1;
              return
            }else{
              //return the cell to is old position              
              cellPos.copy(orignialCellPos);
              
              cell.lastMove = 'invalid';
              cell.invalidPlacement({'message':'Invalid Placement: Underwater', 'cell':cell,'water':intersectionsWater[0].position});
              return;
            }
          }
        }
      }
    }
    cellManager.meshNearestPos = function (pos, meshes, offsetV) {
      /**
       * @doc function
       * @name survival.CellManager:meshNearestPos
       * 
       * @returns mesh a mesh
       * @param vector3 a position vector3
       * @param array an array of meshes
       * @param vector3 a position vector3
       * 
       * @description <description>
       */
      var distance = 10000000;
      var nearestMesh = {};
      if (meshes === undefined || !angular.isArray(meshes)) {
        meshes = cellManager.land;
      }

      for (var i = meshes.length - 1; i >= 0; i--) {
        var mesh = meshes[i];
        if (offsetV) {
          pos.add(offsetV);
        }
        var distanceToMesh = pos.distanceTo(mesh.position);
        if (distance > distanceToMesh) {
          distance = distanceToMesh;
          nearestMesh = mesh;
        } else if (distanceToMesh === distance) {
          // console.log('weird, distance = distanceToMesh');
          distance = distanceToMesh;
          nearestMesh = mesh;
        }
      }
      return nearestMesh
    }
    cellManager.cell = function (cellId) {

      if (cellId === undefined) {
        cellId = 0; 
      }
      if (cellManager.cells[cellId] === undefined) {
        console.log('no cell with cellId', cellManager.cells);
        // cellManager.createCell({id:cellId});
      }
      var cell = cellManager.cells[cellId];
      return {
        closestMesh: function (meshes, offsetV) {
          return cellManager.meshNearestPos(cell.mesh.position, meshes, offsetV);
        },
        move: function (position, data) {
          cellManager.moveCell(cellId, position, data)
        },
        update : function (delta, time) {
          cellManager.cells[cellId].mesh.rotateX(Math.sin(time) * delta);
        },
        mesh : function () {
          return cellManager.cells[cellId].mesh;
        }
      }; 
    };
  });