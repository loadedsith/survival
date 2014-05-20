angular.module('survivalApp')
  .service('LevelManagerService', function ($rootScope, $http, $interval,
                                    DEBUG, FoodManagerService, CellManagerService,
                                    DebugLessService, ThreeJSRendererService, TemplatesService,
                                    StringsService, KeyboardService, TileManagerService) {//$timeout, $interval, 
    'use strict'; 
    console.log('LevelManagerService');
    var levelManager = this;

    $http({method: 'GET', url: 'js/workers/simpleCell.js'})
      .success(function (data) {//status, headers, config
        levelManager.workerBlobText = data;
      })
      .error(function () {//data, status, headers, config
        console.log('failed to get Worker text');
      });

    
    $rootScope.$on('newLimitX', function (e, value) {
      if (value < levelManager.gameboard.min.x) {
        levelManager.gameboard.min.x = value;
      }
      if (value > levelManager.gameboard.max.x) {
        levelManager.gameboard.max.x = value;
      }
    });

    $rootScope.$on('newLimitY', function (e, value) {
      if (value < levelManager.gameboard.min.y) {
        levelManager.gameboard.min.y = value;
      }
      if (value > levelManager.gameboard.max.y) {
        levelManager.gameboard.max.y = value;
      }
    });
    
    levelManager.gameboard = {
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
    };
    
    levelManager.createLevel = function () {
      levelManager.addCells(3);
      levelManager.addTilesToScene();
      levelManager.addFoodSources(1);
    };
    
    levelManager.addFoodSources = function (count) {
      var i = 0;
      while (i < count) {
        CellManagerService.foodSource = FoodManagerService.createFoodSource();
        i++;
      }
    };
    
    levelManager.addCell = function () {
      CellManagerService.createCell({
        workerBlobText: levelManager.workerBlobText
      });
      if (levelManager.shouldAddCellToRenderUpdates) {
        levelManager.shouldAddCellToRenderUpdates = false;
        ThreeJSRendererService.onRenderFcts.push(CellManagerService.cell().update);
      }
    };

    $rootScope.$on('updateWorker', function (event, attributes) {
      console.log('yellow antelope');

      levelManager.workerBlob = new Blob([attributes]);
      console.log('attributes', attributes);
      var blobURL = window.URL.createObjectURL(levelManager.workerBlob);
      if (levelManager.worker !== undefined) {
        levelManager.worker.terminate();
      }
      levelManager.worker = new Worker(blobURL);
      levelManager.worker.addEventListener('message', CellManagerService.cellListener);
    });

    levelManager.addCells = function (count) {
      var i = 0;
      while (i < count) {
        levelManager.addCell();
        i++;
      }
    };
    levelManager.shouldAddTilesToRenderUpdates = true;

    levelManager.addTilesToScene = function () {
      var rows = 25,
          columns = 20,
          scale = 0.125,
          gridHeight = scale,
          gridWidth = scale;
    
      levelManager.tms = TileManagerService;
      levelManager.tms.makeTileGrid({
        'rows' : rows,
        'columns' : columns,
        'scale': {
          x: scale,
          y: scale,
          z: scale
        },
        'gridHeight': gridHeight,
        'gridWidth': gridWidth,
        'positionOffset': {
          x: -0.4 * rows * gridHeight,
          y: -0.65 * columns * gridWidth,
          z: 0
        },
        'positionCallback' : TileManagerService.positionCallbacks.land
      }).then(function (newTiles) {
        TileManagerService.land = [];
        for (var i = newTiles.length - 1; i >= 0; i--) {
          var newTile = newTiles[i].tile;
          if (newTile.mesh.position.x < levelManager.gameboard.min.x) {
            levelManager.gameboard.min.x = newTile.mesh.position.x;
          }
          if (newTile.mesh.position.y < levelManager.gameboard.min.y) {
            levelManager.gameboard.min.y = newTile.mesh.position.y;
          }
          if (newTile.mesh.position.x > levelManager.gameboard.max.x) {
            levelManager.gameboard.max.x = newTile.mesh.position.x;
          }
          if (newTile.mesh.position.y > levelManager.gameboard.max.y) {
            levelManager.gameboard.max.y = newTile.mesh.position.y;
          }
          
          TileManagerService.land[i] = newTiles[i].tile.mesh;
          TileManagerService.land[i].tileType = 'land';
          ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
        }
      });
    
    
      levelManager.water = TileManagerService;
      levelManager.doOnce = true;
      levelManager.water.makeTileGrid({
        'rows' : rows,
        'columns' : columns,
        'scale': {
          x: scale,
          y: scale,
          z: scale
        },
        'gridHeight' : gridHeight,
        'gridWidth' : gridWidth,
        'positionOffset': {
          x: -0.4 * rows * gridHeight,
          y: -0.65 * columns * gridWidth,
          z: -0.15
        },
        'positionCallback' : TileManagerService.positionCallbacks.water
      }).then(function (newTiles) {
        TileManagerService.water = [];
        for (var i = newTiles.length - 1; i >= 0; i--) {
          TileManagerService.water[i] = newTiles[i].tile.mesh;
          TileManagerService.water[i].tileType = 'water';
          ThreeJSRendererService.scene.add(newTiles[i].tile.mesh);
        }
      });
    };
    
  });
