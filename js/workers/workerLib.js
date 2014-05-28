/**
 * @ngdoc module
 * @name survival.workerLib 
 * 
 * @description #WorkerLib
  WorkerLib is available to all webWorkers using `importScripts('workerLib.js');`. It wraps various
  command messages. Allowing a worker to simply map to the message's name, eg; `var echo=function () {\/*do some stuff*\/}`

  **Command Messages: ** Echo, Move
  
 */

/**
 * @ngdoc overview
 * @name survival.workerLib:echo
 * 
 * @description 
    Echo simply asks the cell to repeat what you send it, good for testing but not much else
    worker.postMessage({
      'cmd': 'echo',
      'message': 'Echo from MainCtrl to Cell to MainCtrl'
    }); 
 */

'use strict';


if (typeof self.cell === 'undefined') {
  self.cell = {};
}

var defaultCmds = {
  cellInfo: function (data) {
    // console.log('cellgotGetInfo: ' + JSON.stringify(data));
    self.cell.position = data.cell.position;
    self.cell.id = data.cell.id || 0;
    self.cell.health = data.cell.health || 100;
    
  },
  nearestFoodSource: function (data) {
    // console.log('cellnearestFoodSource: ' + JSON.stringify(data));
    if (self.foodSource === undefined) {
      self.foodSource = {};
    }
    self.foodSource.position = data.foodSource.position;
    self.foodSource.distance = data.foodSource.distance;
    
  },
  init: function (data) {
    // self.postMessage({cmd:'echo','message':'workerGot init' + JSON.stringify(data)});
    self.cell.position = data.cell.position;
    self.cell.id = data.cell.id || 0;
    self.url = data.url || '0.0.0.0:9000';
    self.cell.health = data.cell.health || 100;
    
  },
  echo: function (data) {
    self.postMessage({cmd: 'echo', 'message': data.message});
  },
  invalidPlacement: function (data) {
    self.postMessage({cmd: 'echo', 'message': 'InvalidPlacement: worker got: ' + JSON.stringify(data)});
  },
  move: function (data) {
    self.postMessage({cmd: 'move', 'position': {x: 0, y: 0, z: 0.2}}); 
  }
};

self.addEventListener('message', function (e) {
  var data = {};
  if (e.data !== undefined) {
    data = e.data;
  }
  if (data.cmd !== undefined) {
    switch (data.cmd) {
    case 'cellInfo':
      if (typeof self.cellInfo === 'function') {
        self.cellInfo(data);
      }else{
        defaultCmds.cellInfo(data);
      }
      break;
    case 'nearestFoodSource':
      if (typeof self.nearestFoodSource === 'function') {
        self.nearestFoodSource(data);
      } else {
        defaultCmds.nearestFoodSource(data);
      }
      break;
    case 'init':
      if (typeof self.init === 'function') {
        self.init(data);
      } else {
        defaultCmds.init(data);
      }     
      break;
    case 'echo':
      if (typeof self.echo === 'function') {
        self.echo(data);
      } else {
        defaultCmds.echo(data);
      }     
      break;
    case 'invalidPlacement':
      if (typeof self.invalidPlacement === 'function') {
        self.invalidPlacement(data);
      } else {
        defaultCmds.invalidPlacement(data);
      }
      break;
    case 'move':
      if (typeof self.move === 'function') {
        self.move(data);
      } else {
        defaultCmds.move(data);
      }     
      break;
    }
  }
}, false);