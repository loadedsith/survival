angular.module('survivalApp').factory('StringsService', function ($resource) {
  'use strict';
  // This asset contains store:floors[]
  return $resource('/data/strings.json', {}, {
    retrieve : {method: 'GET', isArray: false}
  });
});
