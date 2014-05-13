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
  console.log('SimpleCell.js: invalidPlacement');
  self.postMessage({
    'cmd':'move',
    'cellId': 0,
    'position': [-0.5 + Math.random() * 1, -0.5 + Math.random() * 1, 0]
  });
}

setInterval(function () {
  self.postMessage({
    'cmd': 'move',
    'cellId': 0,
    'position': [-0.5 + Math.random() * 1,-0.5 + Math.random() * 1, 0]
  }); // Send data to the cellManager.
}, 1000);

importScripts('workerLib.js');


