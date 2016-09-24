(function() {
  angular.module('App')
   // .constant('apiURL', 'https://webdev-dummy.herokuapp.com')
   	.constant('apiURL', 'https://lz44.herokuapp.com')
    .factory('userService', userService)
    .factory('postService', postService)
    
//define api to the dummy server
function userService($resource, apiURL, $http) {
  $http.defaults.withCredentials = true
	return $resource(apiURL + '/:endpoint', { }, 
		{	
			loggedInUser: { method:'GET', params: {endpoint: 'status'  } },
			updateStatus: { method:'PUT', params: {endpoint: 'status'  } },
			addPost: { method:'POST', params: {endpoint: 'poxxxst'  } },
		})
}
function postService($resource, apiURL, $http) {
  $http.defaults.withCredentials = true
  	function resourceUploadFile(data) {
			var fd = new FormData()  
			fd.append('image', data.img)
			fd.append('body', data.body)
			return fd;
	}

	return $resource(apiURL + '/:endpoint/:user', { user: '@user' }, 
		{	
			getPic:{ method:'GET', params: {endpoint: 'pictures'  } },
			getPosts: { method:'GET', params: {endpoint: 'posts'  } },
			updatePosts: { method:'PUT', params: {endpoint: 'posts'  } },
			addReply: { method:'PUT', params: {endpoint: 'posts'  } },
			getStatuses: { method:'GET', params: {endpoint: 'statuses'  } },
			getFollowing: { method:'GET', params: {endpoint: 'following'}},
		    newFollowing: { method:'PUT', params: {endpoint: 'following'}},
		    removeFollowing: {method: 'DELETE', params: {endpoint: 'following'}},
			addPost: { method:'POST', params: {endpoint: 'post'  } },
			upload: { method: 'POST', headers: { 'Content-Type': undefined },
		        	transformRequest: resourceUploadFile, params: {endpoint: 'post'}},
		    getEmail:{method:'GET', params: {endpoint: 'email'}},
		    updateEmail:{method:'PUT', params: {endpoint: 'email'}},
		    getZipcode:{method:'GET', params: {endpoint: 'zipcode'}},
		    updateZipcode:{method:'PUT', params: {endpoint: 'zipcode'}},
		    updatePassword:{method:'PUT', params: {endpoint: 'password'}},
		    uploadAvatar: {method:'PUT', headers: { 'Content-Type': undefined },
		        			transformRequest: resourceUploadFile,
		        			params: {endpoint: 'picture'}},
		})
}


})();