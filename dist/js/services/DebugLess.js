angular.module('survivalApp')
  .service('DebugLessService', function ($interval) {//, $timeout
    'use strict';
    var debugLess = this;

    debugLess.length = 1000;
    debugLess.interval = undefined;
    debugLess.message = undefined;
    debugLess.lastMessage = 'mockLastmessage';

    debugLess.init = function () {
      if (debugLess.interval === undefined) {
        $interval(function () {
          if (debugLess.message !== undefined) {
            if (JSON.stringify(debugLess.lastMessage) !== JSON.stringify(debugLess.message)) {
              console.log('debugLess.message: ', debugLess.message);
              debugLess.lastMessage = debugLess.message;
            }
          }
        }, debugLess.length || 1000);
      }
    };
  });