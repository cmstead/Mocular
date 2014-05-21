(function(ng){
	'use strict';

	var module = ng.module('mocular.service', []);

	(function(){

		function Service($injector){

			var expectation = {
					name: '',
					args: null,
					returnValue: undefined,
					isMet: false
				};

			function buildExpectation($service){
				return function(name, args){
					expectation.name = name;
					expectation.args = (args) ? args : null;
					expectation.isMet = false;

					return $service;
				}
			}

			function build(definition){
				var $service = $injector.get(definition.name),
					methods = (definition.methods) ? definition.methods : [],
					methodName;

				for(var i in methods){
					methodName = methods[i].name;

					$service[methodName] = (typeof $service[methodName] === 'function') ?
						function(){} :
						$service[methodName];
				}

				$service.expectCall = buildExpectation($service);
			}

			return {
				build: build,
			};
		}

		module.factory('$mockingService', ['$injector', Service]);

	})();

})(angular);