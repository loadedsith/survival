/**
 * @doc module
 * @name survival.Workers:SimpleCell
 * 
 * 
 * 
 * @description #Simple Cell
  This web worker is responsible for responding to queries about what the cells are upto.
 */

importScripts('workerLib.js');

var echo = function (data) {
  self.postMessage(data);
};


var cellIds = [];
var cellProperties = {};


