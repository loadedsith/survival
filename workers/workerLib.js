/**
 * @ngdoc module
 * @name survival.workerLib 
 * 
 * @description #WorkerLib
  Makes workers lives easier.
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
        console.log('default echo');
        self.postMessage({cmd:'echo','msg':data.msg});
      }     
      break;
    }
  }
}, false);