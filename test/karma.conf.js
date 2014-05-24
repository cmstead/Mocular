module.exports = function(config){
	config.set({
		basePath: '',

		frameworks: ['jasmine'],

		reporters: ['progress', 'coverage'],

		browsers: ['PhantomJS'],

		files: [
			'lib/angular/angular.min.js',
			'lib/angular/angular-mock.js',
			'resources/mocular.resources.module.js',
			'../src/mocular.js',
			'mocular.spec.js'
		],

		preprocessors: {
			'../src/mocular.js': ['coverage']
		},

		coverageReporter: {
			type: 'text-summary'
		},

		colors: true,

		autoWatch: true,
		singleRun: false
	});


}