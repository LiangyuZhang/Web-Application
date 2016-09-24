(function() {
  var app = angular.module('App', ['ngRoute', 'ngResource']);
  app.config(config);
  
function config($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl: 'app/login/login.html',
	}) 
	.when('/main', {
		templateUrl: 'app/main/main.html',
	})
	.when('/profile', {
		templateUrl: 'app/profile/profile.html',
	})
	.otherwise({
	  		redirectTo: '/login'
	})
}

})();