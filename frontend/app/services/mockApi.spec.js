(function(jasmine) { 	
	var $q
	var promises = []
	

	function init(_$q_) {
		$q = _$q_
	}

	function makePromise(response) {
		var p = $q.defer()
		promises.push({ promise: p, response: response })
		return { $promise: p.promise }
	}

	var mockLoginService =  {

		register: function(){
			return makePromise(
				{'result':'success','username': payload.username }
				)
		},
		// XXX add the login and logout functions here
		login: function(payload) {
			if(payload.username === 'lz44' && payload.password==="111"){
				return makePromise({'username':'lz44', 'result':'success'})
			}
			else{
				return makePromise({'username':'lz44', 'result':'failure'})
			}
		},

		
		logout: function() {
			return makePromise({'username':undefined, 'result':'OK'})
		}

	}

//ADD
	var mockUserService = {

		loggedInUser: function() {
			return makePromise(
				{ "statuses": 
				[{
					'username':'lz44',
					'status':'Happy',
					'avatar':'http://images.all-free-download.com/images/graphiclarge/daisy_pollen_flower_220533.jpg',
					'comments':'comments'
	
				}]
			}
			)
		},

		updateStatus: function(payload) {
			return makePromise(
				{ "statuses": 
				[{
					'username':'lz44',
					'status':'Happy'
	
				}]
			}
			)
		},

		addPost: function(payload) {
			return makePromise(
				{ "posts": 
				[{
						"id":"1",
						"body":"haha",
						"date":"0308",
						"avatar":"http://images.all-free-download.com/images/graphiclarge/daisy_pollen_flower_220533.jpg",
						"comments":
							[{
								"commentId":1,
								"author":"lz44",
								"date":"0308",
								"body":"haha"
							}],
						"author":"lz44"
				}]
			}
			)
		}

	}


//add
	var mockPostService = {
		getPic: function(payload) {
			return makePromise(
				{ "pictures": 
				[{
					'username':'lz44',
					'picture':'http://images.all-free-download.com/images/graphiclarge/daisy_pollen_flower_220533.jpg'
	
				}]
			}
			)
		},
		getPosts: function(payload) {
			return makePromise(
				{ "posts": 
				[{
						"id":"1",
						"body":"haha",
						"date":"0308",
						"avatar":"http://images.all-free-download.com/images/graphiclarge/daisy_pollen_flower_220533.jpg",
						"comments":
							[{
								"commentId":1,
								"author":"lz44",
								"date":"0308",
								"body":"haha"
							}],
						"author":"lz44"
				}]
			}
			)
		},
		updatePosts: function(payload) {
			return makePromise(
				{ "posts": 
				[{
					"id":1,
					"body":"newhaha",
					"date":"0308",
					"img":"http://images.all-free-download.com/images/graphiclarge/daisy_pollen_flower_220533.jpg",
					"comments":
						[{"commentId":1,
						"author":"lz44",
						"date":"0308",
						"body":"haha"}
						],
					"author":"lz44"
	
				}]
			}
			)
		},
		addReply: function(payload) {
			return makePromise(
			{
				"posts":
				[{
					"id":1,
					"body":"haha",
					"date":"0308",
					"img":"http://images.all-free-download.com/images/graphiclarge/daisy_pollen_flower_220533.jpg",
					"comments":'aa',
					"author":"lz44"},
				]
			})
		},
		getStatuses: function(payload) {
			return makePromise(
				{ "statuses": 
				[{
					'username':'lz44',
					'status':'Happy'
	
				}]
			}
			)
		},
		searchKeyword: function(payload) {
			return makePromise(
				{'username':undefined}
			)
		},

		upload: function(payload) {
			return makePromise(
				{ "posts": 
				[{
					"id":1,
					"body":"newhaha",
					"date":"0308",
					"img":"http://images.all-free-download.com/images/graphiclarge/daisy_pollen_flower_220533.jpg",
					"author":"lz44"
				}]}
				)
		}
		// getFollowing: function(payload) {
		// 	return makePromise(
		// 		{'username':undefined}
		// 	)
		// }

		// newFollowing: function(payload) {
		// 	return makePromise(
		// 		{'username':undefined}
		// 	)
		// }

		
	}

	var resolveTestPromises = function(rootScope) {
		promises.forEach(function(p) {
			p.promise.resolve(p.response)
		})
		promises.length = 0
		rootScope.$apply()
	}

	jasmine.helper = {
		init: init,
		mockLoginService: mockLoginService,
		mockUserService: mockUserService,
		mockPostService: mockPostService,
		resolveTestPromises: resolveTestPromises
	}

})(window.jasmine)