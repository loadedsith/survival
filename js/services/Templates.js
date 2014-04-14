angular.module('survivalApp').factory('ThreeJSConfig', function ($resource) {
  'use strict';
  // This asset contains store:floors[]
  return $resource('/threejs.json', {}, {
    retrieve : {method: 'GET', isArray: false}
  });
});
