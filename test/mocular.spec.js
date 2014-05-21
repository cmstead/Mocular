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

				describe(': rewritten method', function(){

					var testObj = {
						bodyWasExecuted: false
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