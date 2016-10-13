angular.module('abAngular', ['ngCookies'])
.service('abAngularService', ['$cookies', function($cookies) {
	
	var runningExperiment = null;
	var experimentsDefinitions = [];
	var storageKey = 'defaultStorageKey';
	
	var analyticsHandlingCallback = null;
	
	function initializeService(options) {
		setExperimentsDefinitions(options.experimentsDefinitions);
		setStorageKey(options.storageKey);
		analyticsHandlingCallback = options.analyticsHandlingCallback;
		
		runningExperiment = getExperimentFromStorage();
		
		if (!experimentsDefinitions.length) {
			return;
		}
		
		if (!runningExperiment) {
			var fairDiceRoll = Math.floor(Math.random() * experimentsDefinitions.length);
			var selectedExperiment = experimentsDefinitions[fairDiceRoll];
			
			var variant = 'A';
			if (selectedExperiment.displayProbability < Math.random()) {
				variant = 'B';
			}
			
			runningExperiment = {
				name: selectedExperiment.name,
				variant: variant
			};
			
			$cookies.putObject(storageKey, runningExperiment);
		}

		if (analyticsHandlingCallback) {
			
			var fullExperimentInfo = experimentsDefinitions.filter(function (experiment) {
				return experiment.name === runningExperiment.name;
			});
			
			analyticsHandlingCallback(fullExperimentInfo[0], runningExperiment.variant);
		}
	}
	
	function getExperimentFromStorage() {
		var experimentFromStorage = $cookies.getObject(storageKey);
		
		if (experimentFromStorage) {
			var exists = experimentsDefinitions.filter(function(experiment) {
				return experiment.name === experimentFromStorage.name
			});
			
			if(!exists.length) {
				$cookies.remove(storageKey);
				experimentFromStorage = null;
			}
		}
		
		return experimentFromStorage;
	}
	
	function setStorageKey(key) {
		storageKey = key;
		runningExperiment = getExperimentFromStorage();
	}
	
	function setExperimentsDefinitions(definitions) {
		experimentsDefinitions = definitions;
	}
	
	function initializeExperiment(experimentName) {
		if(runningExperiment && runningExperiment.name === experimentName) {
			return runningExperiment.variant;
		}
		return null;
	}
	
	return {
		'initializeExperiment': initializeExperiment,
		'initializeService': initializeService
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

