angular.module('app', ['abAngular'])
.controller('MainCtrl', ['abAngularService', function (abAngularService) {
	abAngularService.initializeService({
		storageKey: 'COOKIE_KEY',
		experimentsDefinitions: [
			{name: 'favIconTest', displayProbability: 0.5, experimentId: '1'},
			{name: 'randomTest9', displayProbability: 0.5, experimentId: '2'}
		],
		analyticsHandlingCallback: function (experiment, variant) {
			console.log(experiment);
			console.log(variant);
		}
	});
}]);
