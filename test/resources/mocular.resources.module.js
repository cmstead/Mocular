(function(ng){
	'use strict';

	var module = ng.module('mocular.resources.module', ['mocular.service']);

	(function(){

		function Service(){

			function get(){
				throw new Error('Get was not rewritten');
			}

			function set(){
				throw new Error('Set was not rewritten');
			}

			return {
				get: get,
				set: set
			}
		}

		module.factory('$testService', [Service]);

	})();
})(angular);