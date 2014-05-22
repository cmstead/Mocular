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
                        $testService.expectCall('get').returning('substitute');

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

			});

		});

	});

})();