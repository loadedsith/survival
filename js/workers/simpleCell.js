/**
 * @doc module
 * @name survival.Workers:SimpleCell
 * 
 * @description #Simple Cell
  This web worker is responsible for responding to queries about what the cells are upto.
 */
'use strict';

self.lastTimeStamp = new Date().getTime();
self.cell = {
  id : 0
};


self.echo = function (data) {
  self.postMessage(data);
};

self.cellIds = [];
self.cellProperties = {};

self.move = function () {
  self.postMessage({
    'cmd': 'move',
    'cellId': 0,
    'position': {
      x: 0,
      y: 0,
      z: Math.random() * 1
    }
  });
};
self.eat = function () {
  self.postMessage({
    'cmd': 'eat',
    'cell': self.cell
  }); // Send data to the cellManager.
};
self.getCellInfo = function () {
  self.postMessage({
    'cmd': 'getCellInfo',
    'cell': self.cell
  }); // Send data to the cellManager.
};
self.getNearestFoodSource = function () {
  self.postMessage({
    'cmd': 'getNearestFoodSource',
    'cell': self.cell
  }); // Send data to the cellManager.
};
self.invalidPlacement = function (data) {
  //could be an invalid move, or a deadcell
  if (data.message === 'DeadCell' || data.message === 'DeadCell') {
    clearInterval(self.moveInterval);
    return;
  }
  // console.log('data.message'+JSON.stringify(data.message));
  if (data.position !== undefined) {
    // lastPos = data.position;
    self.lastPos.x = Number(data.position.x);
    self.lastPos.y = Number(data.position.y);
    self.lastPos.z = Number(data.position.z);
  } else {
    console.log(['data', JSON.stringify(data)]);
  }
  self.deltaMove();
};
self.lastPos = {x: -0.5 + Math.random(), y: -0.5 + Math.random(), z: 0};

self.lastTimeStamp = (new Date()).getTime();
self.getDelta = function () {
  var newTimeStamp = (new Date()).getTime();
  var result = newTimeStamp - self.lastTimeStamp;
  self.lastTimeStamp = (new Date()).getTime();
  return result;
};

self.deltaMove = function () {

  var delta = (self.getDelta() + 1) / 1000;
  delta = delta * 2;
  var newPos = {
    x: self.lastPos.x + ((Math.random() - 0.5) * delta),
    y: self.lastPos.y + ((Math.random() - 0.5) * delta),
    z: self.lastPos.z
  };

  self.postMessage({
    'cmd': 'move',
    'cell': self.cell,
    'position': newPos
  }); // Send data to the cellManager.
  self.lastPos = newPos;
};


self.deltaMoveTo = function (pos) {

  var delta = (self.getDelta() + 1) / 1000;
  delta = delta * 2;
  var newPos = {

    x:  self.lastPos.x + (pos.x - self.lastPos.x) * delta,
    y:  self.lastPos.y + (pos.y - self.lastPos.y) * delta,
    z: self.lastPos.z
  };

  self.postMessage({
    'cmd': 'move',
    'cell': self.cell,
    'position': newPos
  }); // Send data to the cellManager.
  self.lastPos = newPos;
};




self.moveInterval = setInterval(function () {
  if (self.cell.health > 40) {
    self.getNearestFoodSource();
    self.deltaMove();
  } else if (self.cell.health > 10){
    self.deltaMoveTo(self.foodSource.position||{x: 0, y: 0, z: 0});
    self.eat();    
  } else{
     //death watch
     self.eat();
     
  }
  self.getCellInfo();
}, 125);
