angular.module('app', ['abAngular'])
.controller('MainCtrl', ['abAngularService', function (abAngularService) {
	abAngularService.setStorageKey('someKey');
}]);
