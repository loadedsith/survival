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
    'cellId': 42,
    'position': [0, 0, Math.random() * 1]
  });
}


importScripts('workerLib.js');
