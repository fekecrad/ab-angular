angular.module('abAngular', ['ngCookies'])
.service('abAngularService', ['$cookies', function($cookies) {
	
	var runningExperiment = null;
	
	var experimentsDefinitions = [];
	
	var storageKey = 'defaultStorageKey';
	
	runningExperiment = getExperimentFromStorage();
	
	function getExperimentFromStorage() {
		return experimentFromStorage = $cookies.getObject(storageKey);
	}
	
	function setStorageKey(key) {
		storageKey = key;
		runningExperiment = getExperimentFromStorage();
	}
	
	function setExperimentsDefinitions(definitions) {
		experimentsDefinitions = definitions;
	}
	
	function initializeExperiment(experimentName) {
		if(runningExperiment) {
			return runningExperiment.variant;
		} else {
			return activateExperiment(experimentName);
		}
	}
	
	function activateExperiment(experimentName) {
		
		var selectedExperiment = experimentsDefinitions.filter(function(experiment) {
			return experiment.name === experimentName;
		});
		
		selectedExperiment = selectedExperiment[0];
		
		var variant = 'A';
		
		if (selectedExperiment.displayProbability < Math.random()) {
			variant = 'B';
		}
		
		$cookies.putObject(storageKey, {
			name: selectedExperiment.name,
			variant: variant
		});
		
		// ga('set', 'expId', selectedExperiment.id)
		if (variant === 'A') {
		// ga('set', 'expVar', '0')
		} else {
		// ga('set', 'expVar', '1')
		}
		
		return variant;
	}
	
	return {
		'initializeExperiment': initializeExperiment,
		'setStorageKey': setStorageKey,
		'setExperimentsDefinitions': setExperimentsDefinitions
	};
}])
.component('experiment', {
	template: [
		'<div ng-transclude="variantA" ng-if="$ctrl.selectedVariant === \'A\'"></div>',
		'<div ng-transclude="variantB" ng-if="$ctrl.selectedVariant === \'B\'"></div>'
	].join(''),
	bindings: {
		name: '<'
	},
	transclude: {
		variantA: 'variantA',
		variantB: 'variantB'
	},
	controller: function (abAngularService) {
		var vm = this;
		
		vm.selectedVariant = null;
		
		vm.$onInit = function () {
			selectedVariant = abAngularService.initializeExperiment(vm.name);
			vm.selectedVariant = selectedVariant ? selectedVariant : 'A';
		}
	}
});

