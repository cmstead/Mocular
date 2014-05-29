(function(){
	'use strict';

	describe('Mocular', function(){

		beforeEach(function(){
			module('mocular.service');
			module('mocular.resources.module');
		});

		describe(': mockingService', function(){
			var $mockingService,
				$testService,
				$injectorPointer;

			beforeEach(inject(function($injector){
				$injectorPointer = $injector;
				$mockingService = $injector.get('$mockingService');
				$testService = $injector.get('$testService');
			}));

			it('should be an object', function(){
				expect(typeof $mockingService).toBe('object');
			});

			describe(': build', function(){

				it('should be a function', function(){
					expect(typeof $mockingService.build).toBe('function');
				});

				it('should not allow the explicit creation of new methods', function(){
					$mockingService.build({
						name: '$testService',
						methods: [
							{
								name: 'foo'
							}
						]
					});

					expect(typeof $testService.foo).toBe('undefined');
				});

				it('should rewrite a specified method', function(){
					var errorThrown = false;

					$mockingService.build({
						name: '$testService',
						methods: [
							{
								name: 'get'
							}
						]
					});

					try{
						$testService.get();
					} catch (error){
						errorThrown = true;
					}

					expect(errorThrown).toBe(false);
				});

                it('should not rewrite methods which are not specified', function(){
                    var errorThrown = false;

                    try{
                        $testService.set();
                    } catch(error) {
                        errorThrown = true;
                    }

                    expect(errorThrown).toBe(true);
                });

				describe(': rewritten method', function(){

					var testObj = {
						bodyWasExecuted: false,
                        substituteWasExecuted: false
					};

					beforeEach(function(){
						testObj.bodyWasExecuted = false;

						$mockingService.build({
							name: '$testService',
							methods: [
								{
									name: 'get',
									body: function(){ testObj.bodyWasExecuted = true; },
									returnValue: 'test'
								}
							]
						});
					});

					it('should execute the body function by default', function(){
						$testService.get();

						expect(testObj.bodyWasExecuted).toBe(true);
					});

					it('should return returnValue by default', function(){
						var returnedValue = $testService.get();

						expect(returnedValue).toBe('test');
					});

					it('should set expectation.isMet to true when expectation is set', function(){
						$testService.expectCall('get');
						$testService.get();

						expect($testService.expectationWasMet()).toBe(true);
					});

                    it('should not set expectation.isMet to true if arguments are not correct', function(){
                        $testService.expectCall('get').withArguments(["test1", "test2"]);
                        $testService.get('test1');

                        expect($testService.expectationWasMet()).toBe(false);
                    });

                    it('should set expectation.isMet to true if arguments are correct', function(){
                        $testService.expectCall('get').withArguments(["test1", "test2"]);
                        $testService.get('test1', 'test2');

                        expect($testService.expectationWasMet()).toBe(true);
                    });

                    it('should execute a substitute body function if it is the expected method', function(){
                        function substitute(){
                            testObj.substituteWasExecuted = true;
                        }

                        $testService.expectCall('get').usingFunction(substitute);

                        $testService.get();

                        expect(testObj.substituteWasExecuted).toBe(true);
                    });

                    it('should return a substitute value if it is the expected method', function(){
                        $testService.expectCall('get').withArguments(['test1', 'test2']).usingFunction(function(){}).returning('substitute');

                        expect($testService.get()).toBe('substitute');
                    });

                });

				describe(': expectCall', function(){

					beforeEach(function(){
						$mockingService.build({
							name: '$testService'
						});
					});

					it('should be a function', function(){
						expect(typeof $testService.expectCall).toBe('function');
					});

                    /*it('should reset expectations after call', function(){
                        $testService.expectCall('get');

                        $testService.get();

                        expect()
                    });*/

                    it('should return service it is defined on when called', function(){
						var $service = $testService.expectCall('get');

						expect($service).toBe($testService);
					});

				});

				describe(': withArguments', function(){

					beforeEach(function(){
						$mockingService.build({
							name: '$testService'
						});
					});

					it('should be a function', function(){
						expect(typeof $testService.withArguments).toBe('function');
					});

					it('should return service it is defined on when called', function(){
						var $service = $testService.withArguments();

						expect($service).toBe($testService);
					});

				});

                describe(': usingFunction', function(){
                    beforeEach(function(){
                        $mockingService.build({
                            name: '$testService'
                        });
                    });

                    it('should be a function', function(){
                        expect(typeof $testService.usingFunction).toBe('function');
                    });

                    it('should return the service it is attached to', function(){
                        var $service = $testService.usingFunction();

                        expect($service).toBe($testService);
                    });
                });

                describe(': returning', function(){
                    beforeEach(function(){
                        $mockingService.build({
                            name: '$testService'
                        });
                    });

                    it('should be a function', function(){
                        expect(typeof $testService.returning).toBe('function');
                    });

                    it('should return the service it is attached to', function(){
                        var $service = $testService.returning();

                        expect($service).toBe($testService);
                    });
                });

				describe(': expectationWasMet', function(){

					beforeEach(function(){
						$mockingService.build({
							name: '$testService'
						});
					});

					it('should be a function', function(){
						expect(typeof $testService.expectationWasMet).toBe('function');
					});

					it('should return a boolean value', function(){
						var returnedValue = $testService.expectationWasMet();

						expect(typeof returnedValue).toBe('boolean');
					});

				});

                describe(': resetExpectation', function(){

                    beforeEach(function(){
                        $mockingService.build({
                            name: '$testService',
                            methods: [
                                {
                                    name: 'get'
                                }
                            ]
                        });
                    });

                    it('should be called after expected function is executed', function(){
                        var resetExpectation = $testService.resetExpectation;

                        $testService.resetExpectation = jasmine.createSpy('resetExpectation');

                        $testService.expectCall('get');

                        $testService.get(); //$testService.expectationWasMet() -> true

                        $testService.get(); //$testService.expectationWasMet() -> false because of reset

                        expect($testService.expectationWasMet()).toBe(false);
                    });

                });

			});

            describe(': buildPromise', function(){

                it('should be a function', function(){
                    expect(typeof $mockingService.buildPromise).toBe('function');
                });

                it('should return an object', function(){
                    var returnedValue = $mockingService.buildPromise();

                    expect(typeof returnedValue).toBe('object');
                });

                describe(': returned promise', function(){

                    var $promise;

                    beforeEach(function(){
                        $promise = $mockingService.buildPromise();
                    });

                    describe(': constructor', function(){

                        it('should set a default return value', function(){
                            var $localPromise = $mockingService.buildPromise();

                            expect(JSON.stringify($localPromise.returnData)).
                                toBe(JSON.stringify([{ data: 'data' }]));
                        });

                        it('should allow the setting of alternate default returnData', function(){
                            var testData = [{ data: "test data" }],
                                $localPromise = $mockingService.buildPromise(testData);

                            expect($localPromise.returnData).toBe(testData);
                        });

                    });

                    describe(': then', function(){

                        it('should be a function', function(){
                            expect(typeof $promise.then).toBe('function');
                        });

                        it('should return its parent object', function(){
                            var returnedValue = $promise.then(function(){});

                            expect(returnedValue).toBe($promise);
                        });

                        it('should call resolve function if resolvePromise is true', function(){
                            var callbackWasCalled = false;

                            function callback(){
                                callbackWasCalled = true;
                            }

                            $promise.resolve();

                            $promise.then(callback);

                            expect(callbackWasCalled).toBe(true);
                        });

                        it('should not execute anything if resolve is null and resolvePromise is true', function(){
                            var functionWasCalled = false;

                            function callback(){
                                functionWasCalled = true;
                            }

                            $promise.then(null, callback);

                            expect(functionWasCalled).toBe(false);
                        });

                        it('should call reject function if resolvePromise is false', function(){
                            var functionCalled = '';

                            function resolve(){
                                functionCalled = "resolve";
                            }

                            function reject(){
                                functionCalled = "reject";
                            }

                            $promise.reject();

                            $promise.then(resolve, reject);

                            expect(functionCalled).toBe('reject');

                        });

                        it('should call resolve function with defined arguments', function(){
                            var result1, result2;

                            function callback(argument1, argument2){
                                result1 = argument1;
                                result2 = argument2;
                            }

                            $promise.resolve().withValues(['test1', 'test2']);

                            $promise.then(callback);

                            expect(JSON.stringify([result1, result2])).toBe(JSON.stringify(['test1','test2']));
                        });

                        it('should call reject with an error object', function(){
                            var response;

                            function callback(error){
                                response = error;
                            }

                            $promise.reject();

                            $promise.then(null, callback);

                            expect(response.getMessage()).toBe('An error occurred.');
                        });

                        it('should reset promise resolution after call', function(){
                            var rejectCalled = false;

                            function resolve(){
                                rejectCalled = false;
                            }

                            function reject(){
                                rejectCalled = true;
                            }

                            $promise.reject();

                            $promise.then(resolve, reject);
                            $promise.then(resolve, reject);

                            expect(rejectCalled).toBe(false);
                        });

                    });

                    describe(': catch', function(){

                        it('should be a function', function(){
                            expect(typeof $promise.catch).toBe('function');
                        });

                        it('should call $promise.then with null and a reject function', function(){
                            function callback(){};

                            $promise.then = jasmine.createSpy('then');
                            $promise.catch(callback);

                            expect($promise.then).toHaveBeenCalledWith(null, callback);
                        });

                        it('should return the $promise object', function(){
                            var returnedValue = $promise.catch(function(){});

                            expect(returnedValue).toBe($promise);
                        });

                    });

                    describe(': finally', function(){

                        it('should be a function', function(){
                            expect(typeof $promise.finally).toBe('function');
                        });

                        it('should call passed callback', function(){
                            var functionWasCalled = false;

                            function callback(){
                                functionWasCalled = true;
                            }

                            $promise.finally(callback);

                            expect(functionWasCalled).toBe(true);
                        });

                    });

                    describe(': resolve', function(){

                        it('should be a function', function(){
                            expect(typeof $promise.resolve).toBe('function');
                        });

                        it('should return the promise object', function(){
                            var returnedValue = $promise.resolve();

                            expect(returnedValue).toBe($promise);
                        });

                        it('should set resolvePromise', function(){
                            $promise.resolvePromise = false;
                            $promise.resolve();

                            expect($promise.resolvePromise).toBe(true);
                        });

                    });

                    describe(': reject', function(){

                        it('should be a function', function(){
                            expect(typeof $promise.reject).toBe('function');
                        });

                        it('should return the promise object', function(){
                            var returnedValue = $promise.reject();

                            expect(returnedValue).toBe($promise);
                        });

                        it('should set resolvePromise to false', function(){
                            $promise.reject();

                            expect($promise.resolvePromise).toBe(false);
                        });

                    });

                    describe(': withValues', function(){

                        it('should be a function', function(){
                            expect(typeof $promise.withValues).toBe('function');
                        });

                        it('should set returnData', function(){
                            var returnData = ['test'];

                            $promise.withValues(returnData);

                            expect($promise.returnData).toBe(returnData);
                        });
                    });

                });

            });

		});

	});

})();