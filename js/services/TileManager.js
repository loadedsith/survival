angular.module('survivalApp')
  .service('TileManagerService', function (ThreeJSRendererService,DebugLessService) {//$interval, $timeout
    'use strict';
    var tileManager = this;
    var landColor = function (value) {
      // DebugLessService.msg = value;
      return {
        r: (value * 0.7) + 0.3,
        g: (value * 0.5) + 0.3,
        b: (value * 0.1) + 0.1
      }
    };
    this.tiles = [];
    
    this.shouldAddTilesToRenderUpdates = true;
    
    this.positionCallbacks = {
      smallPerlin : function (delta, time, tile) {
        // #### perlinCallback
        
        if (tile.seed === undefined) {
          tile.seed = Math.random();
        }
        // noise.simplex2 and noise.perlin2 return values between -1 and 1.
        var value =  noise.simplex3(tile.row / 20, tile.column / 20, tile.seed / 8);
        tile.mesh.position.z = value;
      },
      land : function (delta, time, tile) {
        // #### perlinCallback
        
        if (tile.seed === undefined) {
          tile.seed = Math.random();
        }
        // noise.simplex2 and noise.perlin2 return values between -1 and 1.
        var value =  noise.simplex3(tile.row / 20, tile.column / 20, tile.seed / 8);
        tile.mesh.position.z = value;
        tile.material.color = landColor(value);
      },
      water : function (delta, time, tile) {
        // #### perlinCallback
        if (tile.seed === undefined) {
          tile.seed = Math.random();
        }
        // noise.simplex2 and noise.perlin2 return values between -1 and 1.
        var value =  noise.simplex3(tile.row / 20, tile.column / 20, (tile.seed + time) / 4);

        // tile.mesh.position.z = value/10;
        tile.material.color.r = 0;
        tile.material.color.g = 0;
        tile.material.color.b = (value * 0.5) + 0.5;
        
      },
      original : function (delta, time, tile) {
        // #### perlinCallback
        // noise.simplex2 and noise.perlin2 return values between -1 and 1.
        var value = noise.simplex3(tile.row / 10, tile.column / 10, time / 4);

        tile.material.color.r = value;
        tile.material.color.g = value;
        tile.material.color.b = value;

        tile.mesh.position.z = value;
      }
    };

    
    this.getTileInfo = function (tile) {
      var object = {
        tileId: tile.id,
        row: tile.row,
        column: tile.column,
        rotation: {'x': tile.rotation.x, 'y': tile.rotation.y, 'z': tile.rotation.z},
        scale: {'x': tile.scale.x, 'y': tile.scale.y, 'z': tile.scale.z},
        color: tile.color
      };
      return JSON.stringify(object);
    };
    
    this.getTileAtCoord = function (row, column) {
      for (var i = tileManager.tiles.length - 1; i >= 0; i--) {
        var tile = tileManager.tiles[i];
        // console.log('tile.row:' + tile.row + ' === ' + row + ', tile.column:' + tile.column + ' === ' + column);
        if (Number(tile.row) === Number(row) && Number(tile.column) === Number(column)) {
          return tileManager.getTileInfo(tile);
        } else {
          // console.log('nope');
        }
      }
      throw 'invalid Tile';
    };
    
    this.getTileById = function (id) {
      for (var i = tileManager.tiles.length - 1; i >= 0; i--) {
        var tile = tileManager.tiles[i];
        // console.log('tile.id:'+tile.id+' === '+id);
        if (Number(tile.id) === Number(id)) {
         // return getTileInfo(tile);
          return tile;
        }
      }
      throw 'invalid Tile';
    };
    this.loadTiles = function (tiles) {
      if (typeof tiles !== 'undefined') {
        for (var i = tiles.length - 1; i >= 0; i--) {
          var tile = tiles[i];
          tileManager.createTile(tile);
        }
        console.log('Smarty Spur-winged Goose', tiles);
      }
    };
    this.getTiles = function () {
      var theTiles = '[';
      for (var i = tileManager.tiles.length - 1; i >= 0; i--) {
        var tile = tileManager.tiles[i];
        // console.log('tile.id:'+tile.id+' === '+id);
        var object = {
          tileId: tile.id,
          row: tile.row,
          column: tile.column,
          rotation: {
            'x': tile.rotation.x,
            'y': tile.rotation.y,
            'z': tile.rotation.z
          },
          scale: {
            'x': tile.scale.x,
            'y': tile.scale.y,
            'z': tile.scale.z
          },
          position: {
            'x': tile.position.x,
            'y': tile.position.y,
            'z': tile.position.z
          },
          callback: tile.callback,
          positionCallback: tile.positionCallback,
          color: tile.color
        };    
        theTiles += JSON.stringify(object);
        if (i !== 0) {
          theTiles += ',';
        }
      }
      theTiles += ']';
      return JSON.parse(theTiles);
    };
    // Todo: all make blah blah's operate thusly:
    /*
        MyNamespace.MyModule = (function () {
            var my = {}, 
                username = 'Anonymous',
                policyId = null,
                displayRows = 50;

            my.init = function(config) {
                config = config || {};
                username = config.username || username;
                policyId = config.policyId || policyId;
                displayRows = config.displayRows || displayRows;
            };

            return my;
        })();
    
    */ 
    
    this.makeTileGrid = function (config) {
      var defaults = {
        rows : 8,
        columns : 8,
        xOffset : -0.4,
        yOffset : -0.5,
        gridWidth : 0.1,
        gridHeight : 0.1,
        // tiles : [],
        positionCallback : tileManager.positionCallbacks.original,
        scale: {
          'x': 0.2,
          'y': 0.2,
          'z': 0.3
        }
      };

      var rows = config.rows ? parseInt(config.rows, 10) : defaults.rows,
        columns = config.columns ? parseInt(config.columns, 10): defaults.columns,
        xOffset = config.xOffset || defaults.xOffset,
        yOffset = config.yOffset || defaults.yOffset,
        scale = config.scale || defaults.scale,
        tiles = [],
        gridWidth = config.gridWidth || defaults.gridWidth,
        gridHeight = config.gridHeight || defaults.gridHeight,
        // tiles = config.tiles || defaults.tiles,
        positionCallback = config.positionCallback || defaults.positionCallback,
        tileCallback = function (id) {
          var tile = tileManager.getTileById(id);
          if (tile) {
            tile.material.color = new THREE.Color('#000000');
          }
        };
        var customPositionCallback =  function (delta, time, tile) {
          if(typeof positionCallback === 'function'){
            positionCallback(delta, time, tile);
          } else {
            console.log('positionCallback is not a function')
          }
        };
      
      defaults.position = function(row, column){
        // console.log('row', row);
        // console.log('column', column);
        return {
            'x': (row * gridHeight) + xOffset,
            'y': (column * gridHeight) + yOffset,
            'z': 0
          }
        }
      var position = config.position || defaults.position;
      
      
      for (var row = 1; row <= rows; row++) {
        for (var column = 1; column <= columns; column++) {
          var newTile = {
              'row': row,
              'column': column,
              'callback': tileCallback,
              'positionCallback': customPositionCallback,
              'scale': scale
            };
          
          if (typeof position === 'function') {
            newTile.position = position(row, column);
          }
          var tile = tileManager.createTile(newTile);
            

          tiles.push(tile);
        }
        column++;
      }
      return {
        then: function (callback) {
          if (typeof callback === 'function') {
            callback(tiles);
          }
        }
      };
    };
    this.updateTiles = function (delta, time) {
      for (var i = tileManager.tiles.length - 1; i >= 0; i--) {
        var tile = tileManager.tiles[i];
        tile.mesh.rotateX(tile.rotation.x * delta);
        tile.mesh.rotateY(tile.rotation.y * delta);
        tile.mesh.rotateZ(tile.rotation.z * delta);
        if (typeof tile.positionCallback !== 'undefined') {
          tile.positionCallback(delta, time, tile);
        }
      }
    
    };
    this.createTile = function (config) {
      // console.log('config',config);
      var id = tileManager.tiles.length;
      // console.log('create tile id:' + id, '@ (' + (config.row||0) + ',' + (config.column || 0) + ')');
      var newColor = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
      var newTile =  {
        'color': new THREE.Color(config.color || newColor),
        'row': config.row || 0,
        'column': config.column || 0,
        'id': config.id || id,
        'rotation': {
          'x': config.rotation ? (config.rotation.x || 0): 0,
          'y': config.rotation ? (config.rotation.y || 0): 0,
          'z': config.rotation ? (config.rotation.z || 0): 0
        },
        'scale': {
          'x': config.scale ? (config.scale.x || 0.6) : 0.6,
          'y': config.scale ? (config.scale.y || 0.6) : 0.6,
          'z': config.scale ? (config.scale.z || 0.6) : 0.6
        },
        'position': {
          'x': config.position ? (config.position.x || 0) : 0,
          'y': config.position ? (config.position.y || 0) : 0,
          'z': config.position ? (config.position.z || 0) : 0
        }
      };
      newTile.material = new THREE.MeshPhongMaterial({color: newTile.color});
      newTile.geometry = new THREE.CubeGeometry(newTile.scale.x, newTile.scale.y, newTile.scale.z);
      newTile.mesh = new THREE.Mesh(newTile.geometry, newTile.material);
      newTile.mesh.position.x = 2 * newTile.position.x;
      newTile.mesh.position.y = 2 * newTile.position.y;
      newTile.mesh.position.z = 2 * newTile.position.z;
      if (typeof config.callback === 'undefined') {
        newTile.mesh.callback = function (tileId) {
          console.log('clicked tile: ' + tileId);
        };        
      } else {
        newTile.mesh.callback = config.callback;
      }
      if (typeof config.positionCallback === 'undefined') {
        newTile.positionCallback = function () {};
      } else {
        newTile.positionCallback = config.positionCallback;
      }
      
      if (tileManager.shouldAddTilesToRenderUpdates) {
        console.log('tileManager.shouldAddTilesToRenderUpdates');
        ThreeJSRendererService.onRenderFcts.push(tileManager.updateTiles);
        tileManager.shouldAddTilesToRenderUpdates = false;
      }
      
      tileManager.tiles.push(newTile);
    
      return {tile: newTile};
    };


    this.dumpTiles = function () {
      console.log('Dump', tileManager.getTiles());
    };
  
    this.saveTiles = function () {
      if (typeof tileManager.tileSets === 'undefined') {
        tileManager.tileSets = [tileManager.getTiles()];
      } else {
        tileManager.tileSets.push(tileManager.getTiles());
      }
    };
  });