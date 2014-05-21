(function(ng){
	'use strict';

	var module = ng.module('mocular.service', []);

	(function(){

		function Service($injector){

			var expectation = {
				name: '',
				args: null,
				body: function(){},
				returnValue: undefined,
				isMet: false
			};

			function verifyExpectation(name){
				var nameIsCorrect = (name === expectation.name);
				expectation.isMet = (nameIsCorrect) ? true : expectation.isMet;
			}

			function buildMethodFunction(definition){
				return function(){
					var functionBody = (typeof definition.body === 'function') ? definition.body : function(){};

					verifyExpectation(definition.name);
					functionBody();

					return definition.returnValue;
				}
			}

			function buildExpectation($service){
				return function(name, args){
					expectation.name = name;

					//Reset values to default
					expectation.args = null;
					expectation.body = function(){};
					expectation.returnValue = undefined;
					expectation.isMet = false;

					return $service;
				}
			}

			function buildArgumentHandler($service){
				return function(args){
					expectation.args = args;

					return $service;
				}
			}

			function expectationWasMet(){
				return expectation.isMet;
			}

			function build(definition){
				var $service = $injector.get(definition.name),
					methods = (definition.methods) ? definition.methods : [],
					methodName;

				for(var i in methods){
					methodName = methods[i].name;

					$service[methodName] = (typeof $service[methodName] === 'function') ?
						buildMethodFunction(methods[i]) :
						$service[methodName];
				}

				$service.expectCall = buildExpectation($service);
				$service.withArguments = buildArgumentHandler($service);
				$service.expectationWasMet = expectationWasMet;
			}

			return {
				build: build,
			};
		}

		module.factory('$mockingService', ['$injector', Service]);

	})();

})(angular);