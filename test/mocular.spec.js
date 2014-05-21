(function(){
	'use strict';

	describe('Mocular', function(){

		beforeEach(function(){
			module('mocular.service');
			module('mocular.resources.module');
		});

		describe('mockingService', function(){
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

			describe('build', function(){

				it('should be a function', function(){
					expect(typeof $mockingService.build).toBe('function');
				});

				it('should rewrite a specified method', function(){
					var errorThrown = false;

					$mockingService.build({
						name: '$testService',
						methods: [
							{
								name: 'get',
								arguments: []
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

				it('should not allow the explicit creation of new methods', function(){
					$mockingService.build({
						name: '$testService',
						methods: [
							{
								name: 'foo',
								arguments: []
							}
						]
					});

					expect(typeof $testService.foo).toBe('undefined');
				});

				it('should add expectCall function to service', function(){
					$mockingService.build({
						name: '$testService'
					});

					expect(typeof $testService.expectCall).toBe('function');
				});

			});

		});

	});

})();