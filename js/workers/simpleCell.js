

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
    'position': [0, 0, Math.random() * 1]
  });
};

self.getCellInfo = function () {
  //TODO post mesaage, ask for cell info
};
self.invalidPlacement = function (data) {
  //could be an invalid move, or a deadcell
  if (data.msg === 'DeadCell' || data.message === 'DeadCell') {
    clearInterval(self.moveInterval);
    return;
  }
  // console.log('data.msg'+JSON.stringify(data.msg));
  if (data.position !== undefined) {
    // lastPos = data.position;
    self.lastPos[0] = Number(data.position.x);
    self.lastPos[1] = Number(data.position.y);
    self.lastPos[2] = Number(data.position.z);
  } else {
    console.log(['data', JSON.stringify(data)]);
  }
  self.deltaMove();
};
self.lastPos = [-0.5 + Math.random(), -0.5 + Math.random(), 0];

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
  var newPos = [
    self.lastPos[0] + ((Math.random() - 0.5) * delta),
    self.lastPos[1] + ((Math.random() - 0.5) * delta),
    self.lastPos[2]
  ];

  self.postMessage({
    'cmd': 'move',
    'cellId': self.cell.id,
    'position': newPos
  }); // Send data to the cellManager.
  self.lastPos = newPos;
};
self.moveInterval = setInterval(function () {
  // self.deltaMove();
  self.getCellInfo();
}, 125);