/*jshint */
/*global beforeEach:false */
/*global describe:false */
/*global inject:false */
/*global spyOn:false */
/*global it:false */
/*global expect:false */

'use strict';

describe('Controller: MainCtrl', function () {
  var $rootScope,
    $q,
    $controller,
    $scope,
    // $timeout,
    // $interval,
    retrieveDeferredStrings,
    retrieveDeferredTemplatesService,
    mockStringsService,
    mockTemplatesService,
    mockThreeJSRendererService,
    getDeferred,
    MainCtrl,
    ThreeJSRendererService;

  // load the controller's module

  beforeEach(module('survivalApp', function ($provide) {
    $provide.service('ThreeJSRendererService', function (ThreeJSConfigService) { 
      this.init = function () {};
      this.doneFunctions = [];
    });
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    // Get hold of a scope (i.e. the root scope)

    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    // The $controller, $timeout, and $interval services are used to create instances of controllers, and manipulate time
    $controller = $injector.get('$controller');
    ThreeJSRendererService = $injector.get('ThreeJSRendererService');

    $q = $injector.get('$q');
    getDeferred = $q.defer();

    mockStringsService = {
      retrieve: function () {
        retrieveDeferredStrings = $q.defer();
        return {$promise: retrieveDeferredStrings.promise};
      }
    };
    spyOn(mockStringsService, 'retrieve').and.callThrough();

    mockTemplatesService = {
      retrieve: function () {
        retrieveDeferredTemplatesService = $q.defer();
        return {$promise: retrieveDeferredTemplatesService.promise};
      }
    };
    spyOn(mockTemplatesService, 'retrieve').and.callThrough();
    
    spyOn(ThreeJSRendererService, 'init');
    
    MainCtrl = $controller('MainCtrl', {
      '$scope' : $scope,
      'StringsService': mockStringsService,
      'TemplatesService': mockTemplatesService
    });

  }));

  beforeEach(function () {

    retrieveDeferredStrings.resolve({'test':'test'});
    retrieveDeferredTemplatesService.resolve({'test':'test'});


    $rootScope.$apply();
  });
  
  it('should query the mockTemplatesService', function () {
    expect(mockTemplatesService.retrieve).toHaveBeenCalled();
  });

  it('should query the mockStringsService', function () {
    expect(mockStringsService.retrieve).toHaveBeenCalled();
  });


});