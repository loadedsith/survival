/**
 * @doc module
 * @name survival.Workers:SimpleCell
 * 
 * @description #Simple Cell
  This web worker is responsible for responding to queries about what the cells are upto.
 */
'use strict';

self.lastTimeStamp = new Date().getTime();
self.cellId = 0;


self.echo = function (data) {
  self.postMessage(data);
};

self.cellIds = [];
self.cellProperties = {};

self.move = function () {
  self.postMessage({
    'cmd':'move',
    'cellId': 0,
    'position': [0, 0, Math.random() * 1]
  });
}


self.invalidPlacement = function (data) {
  if (data.position !== undefined){
    // lastPos = data.position;
    self.lastPos[0] = Number(data.position.x);
    self.lastPos[1] = Number(data.position.y);
    self.lastPos[2] = Number(data.position.z);
  }else{
    console.log(['data', JSON.stringify(data)]);
  }
  deltaMove();
}
self.lastPos = [-0.5 + Math.random(), -0.5 + Math.random(), 0];
self.deltaMove = function () {

  var delta = (getDelta() + 1) / 1000;
  delta = delta * 2;
  var newPos = [
    self.lastPos[0] + ((Math.random()-0.5) * delta),
    self.lastPos[1] + ((Math.random()-0.5) * delta),
    self.lastPos[2]
    ];

  self.postMessage({
    'cmd': 'move',
    'cellId': cellId,
    'position': newPos
  }); // Send data to the cellManager.
  self.lastPos = newPos;
};
setInterval(function () {
  self.deltaMove();
}, 1250);

importScripts('http://' +'0.0.0.0:9000' + '/js/workers/workerLib.js');


