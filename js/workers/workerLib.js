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
var getDelta = function () {
  var newTimeStamp = (new Date()).getTime();
  var result = newTimeStamp - lastTimeStamp;
  lastTimeStamp = (new Date()).getTime();
  return result;
};


self.addEventListener('message', function (e) {

  var data = {};
  if (e.data !== undefined) {
    data = e.data;
  }
  if (data.cmd !== undefined) {
    switch (data.cmd) {
    case "init":
      if (typeof self.init === 'function') {
        self.init(data);
      } else {
        self.postMessage({cmd:'echo','msg':'workerGot init' + JSON.stringify(data)});
        self.cellId = data.cellId||0;
      }     
      break;
    case "echo":
      if (typeof self.echo === 'function') {
        self.echo(data);
      } else {
        self.postMessage({cmd:'echo','msg':data.msg});
      }     
      break;
    case "invalidPlacement":
      if (typeof self.invalidPlacement === 'function') {
        self.invalidPlacement(data);
      } else {
        self.postMessage({cmd:'echo','msg':'InvalidPlacement: worker got: ' + JSON.stringify(data)});
      }     
      break;
    case "move":
      if (typeof self.move === 'function') {
        self.move(data);
      } else {
        self.postMessage({cmd:'move','position':[0,0,0.2]});
      }     
      break;
    }
  }
}, false);