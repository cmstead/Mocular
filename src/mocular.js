(function(ng){
	'use strict';

	var Promise,
        module = ng.module('mocular.service', []);

    //Mock promise definition
    (function(){

        function promise(data){
            this.returnData = (data) ? data : [{ data: "data" }];
        }

        promise.prototype = {
            resolvePromise: true,
            returnData: [],

            then: function(resolve, reject){

                if(resolve && this.resolvePromise){
                    resolve.apply(this, this.returnData);
                } else if(!this.resolvePromise) {
                    reject.apply(this, [{ getMessage: function(){
                        return "An error occurred.";
                    } }]);
                }

                return this;
            },

            catch: function(reject){
                return this.then(null, reject);
            },

            finally: function(callback){
                callback();
            },

            resolve: function(){
                this.resolvePromise = true;
                return this;
            },

            reject: function(){
                this.resolvePromise = false;
                return this;
            },

            withValues: function(returnData){
                this.returnData = returnData;
            }
        };

        Promise = promise;
    })();

    //Service mocking service
	(function(){

		function Service($injector){

			var expectation = {
				name: '',
				args: null,
				body: null,
				returnValue: undefined,
				isMet: false
			};

            function expectationWasMet(){
                return expectation.isMet;
            }

            //Verification methods for function execution
            function verifyArguments(args){
                var argumentsOkay = true,
                    expectedArgs = (expectation.args) ? expectation.args : [];

                for(var i in expectedArgs){
                    if(expectedArgs.hasOwnProperty(i) && expectedArgs[i] !== args[i]){
                        argumentsOkay = false;
                        break;
                    }
                }

                return argumentsOkay;
            }

            function verifyExpectation(name, args){
				var nameIsCorrect = (name === expectation.name),
                    argumentsAreCorrect = verifyArguments(args);
				expectation.isMet = (nameIsCorrect && argumentsAreCorrect);
			}

            //Handlers for the various appended service functions
            function buildArgumentHandler($service){
                return function(args){
                    expectation.args = args;

                    return $service;
                }
            }

            function buildBodyFunctionHandler($service){
                return function(bodyFunction){
                    expectation.body = (typeof bodyFunction === 'function') ? bodyFunction : null;

                    return $service;
                }
            }

            function buildExpectationHandler($service){
				return function(name){
					expectation.name = name;

					//Reset values to default
					expectation.args = null;
					expectation.body = null;
					expectation.returnValue = undefined;
					expectation.isMet = false;

					return $service;
				}
			}

            function buildReturnHandler($service){
                return function(value){
                    expectation.returnValue = value;

                    return $service;
                }
            }

            //Construct replacement function for service method
            function buildMethodFunction(definition){
                return function(){
                    var functionBody = (typeof definition.body === 'function') ? definition.body : function(){},
                        isExpectedFunction = (definition.name === expectation.name);

                    verifyExpectation(definition.name, arguments);

                    if(isExpectedFunction && typeof expectation.body === 'function'){
                        expectation.body();
                    } else {
                        functionBody();
                    }

                    return (isExpectedFunction && expectation.returnValue) ?
                        expectation.returnValue :
                        definition.returnValue;
                }
            }

            //Exposed build function
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

				$service.expectCall = buildExpectationHandler($service);
				$service.withArguments = buildArgumentHandler($service);
                $service.usingFunction = buildBodyFunctionHandler($service);
                $service.returning = buildReturnHandler($service);

				$service.expectationWasMet = expectationWasMet;
			}

            function buildPromise(data){
                return new Promise(data);
            }

			return {
				build: build,
                buildPromise: buildPromise
			};
		}

		module.factory('$mockingService', ['$injector', Service]);

	})();

})(angular);