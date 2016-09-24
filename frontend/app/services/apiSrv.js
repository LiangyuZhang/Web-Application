(function() {
  angular.module('App')
    //.constant('apiURL', 'https://webdev-dummy.herokuapp.com')
    //.constant('apiURL', 'http://localhost:3000')
    .constant('apiURL', 'https://lz44.herokuapp.com')
    .factory('loginService', loginService)

function loginService($resource, apiURL, $http) {
  	$http.defaults.withCredentials = true
	return $resource(apiURL + '/:endpoint', { }, 
		{
			register : { method:'POST', params: {endpoint: 'register'}},
			login    : { method:'POST', params: {endpoint: 'login'  } },
			logout    : { method:'PUT', params: {endpoint: 'logout'  } },
			auth : {method:'GET',params: {endpoint: 'auth'  } },
		})
}

})();