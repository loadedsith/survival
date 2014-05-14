/**
 * @doc module
 * @name survival.Workers:SimpleCell
 * 
 * 
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

var invalidPlacement = function (a, b, c) {
  // console.log('SimpleCell.js: invalidPlacement');
  // self.postMessage({
  //   'cmd':'move',
  //   'cellId': 0,
  //   'position': [-0.5 + Math.random() * 1, -0.5 + Math.random() * 1, 0]
  // });
  // deltaMove()
}
var lastPos = [-0.5 + Math.random(), -0.5 + Math.random(), 0];
var deltaMove = function () {

  var delta = (getDelta() + 1) / 100;
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
  deltaMove();
},1);

importScripts('workerLib.js');


