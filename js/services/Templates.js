angular.module('survivalApp').factory('TemplatesService', function ($resource) {
  'use strict';
  // This asset contains store:floors[]
  return $resource('/data/templates.json', {}, {
    retrieve : {method: 'GET', isArray: false}
  });
});
