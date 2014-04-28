angular.module('survivalApp')
  .service('DebugLessService', function ($interval) {//, $timeout
    'use strict';
    var debugLess = this;

    debugLess.length = 1000;
    debugLess.interval = undefined;
    debugLess.msg = undefined;
    debugLess.lastMsg = 'mockLastMsg';

    debugLess.init = function () {
      if (debugLess.interval === undefined) {
        $interval(function () {
          if (debugLess.msg !== undefined) {
            if (JSON.stringify(debugLess.lastMsg) !== JSON.stringify(debugLess.msg)) {
              console.log('debugLess.msg: ', debugLess.msg);
              debugLess.lastMsg = debugLess.msg;
            }
          }
        }, debugLess.length || 1000);
      }
    };
  });