/**
 * @doc module
 * @name survival.Workers:SimpleCell
 * 
 * @description #Simple Cell
  This web worker is responsible for responding to queries about what the cells are upto.
 */
'use strict';

var lastTimeStamp = new Date().getTime();



var echo = function (data) {
  self.postMessage(data);
};

var cellIds = [];
var cellProperties = {};

var move = function () {
  self.postMessage({
    'cmd':'move',
    'cellId': 0,
    'position': [0, 0, Math.random() * 1]
  });
}

var invalidPlacement = function (data) {
  if (data.position !== undefined){
    // lastPos = data.position;
    lastPos[0] = Number(data.position.x);
    lastPos[1] = Number(data.position.y);
    lastPos[2] = Number(data.position.z);
    // console.log(['data.position.x', data.position.x]);
    // console.log(['lastPos.x', lastPos.x]);
    // console.log(['data.message', JSON.stringify(data.message)]);
  }else{
    console.log(['data', JSON.stringify(data)]);
  }
  deltaMove();
}
var lastPos = [-0.5 + Math.random(), -0.5 + Math.random(), 0];
var deltaMove = function () {
  var delta = (getDelta() + 1) / 1000;
  delta = delta * 2;
  var newPos = [
    lastPos[0] + ((Math.random()-0.5) * delta),
    lastPos[1] + ((Math.random()-0.5) * delta),
    lastPos[2]
    ];
  self.postMessage({
    'cmd': 'move',
    'cellId': 0,
    'position': newPos
  }); // Send data to the cellManager.
  lastPos = newPos;
};
setInterval(function () {
  // deltaMove();
},100);

importScripts('workerLib.js');


