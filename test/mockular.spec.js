(function(){
	'use strict';

	describe('Mockular', function(){

		beforeEach(function(){
			module('mocular.service');
		});

		describe('mockingService', function(){
			var $mockingService;

			beforeEach(inject(function($injector){
				$mockingService = $injector.get('$mockingService');
			}));

			it('should be an object', function(){
				expect(typeof $mockingService).toBe('object');
			});

		});

	});

})();