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
      'msg': 'Echo from MainCtrl to Cell to MainCtrl'
    }); 
 */

'use strict';
self.addEventListener('message', function (e) {
  var data = {};
  if (e.data !== undefined) {
    data = e.data;
  }
  if (data.cmd !== undefined) {
    switch (data.cmd) {
    case "echo":
      if (typeof echo === 'function') {
        echo(data);
      } else {
        self.postMessage({cmd:'echo','msg':data.msg});
      }     
      break;
    case "invalidPlacement":
      if (typeof invalidPlacement === 'function') {
        invalidPlacement(data);
      } else {
        self.postMessage({cmd:'echo','msg':'worker got ' + invalidPlacement + ' / ' + data.msg});
      }     
      break;
    case "move":
      if (typeof move === 'function') {
        move(data);
      } else {
        self.postMessage({cmd:'move','position':[0,0,0.2]});
      }     
      break;
    }
  }
}, false);