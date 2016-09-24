describe('Main Controller Tests', function() {
	var helper 
	var ctrl;
	var promises = []

	beforeEach(module('App'))	

	beforeEach(inject(function($controller, $rootScope, $q) {		
		helper=jasmine.helper
		helper.init($q)
 		ctrl = $controller('mainController', {
			'loginService': helper.mockLoginService,
			'userService': helper.mockUserService,
			'postService': helper.mockPostService

		})
		ctrl._resolveTestPromises = function() {
			helper.resolveTestPromises($rootScope)
		}
		ctrl._resolveTestPromises()
	}))

	it('Adding a new post', function() {
		ctrl.gotoProfile()
		ctrl.username="lz44"
		ctrl.addPost();
		ctrl._resolveTestPromises()
		ctrl._resolveTestPromises()
		expect(ctrl.posts.length).toBe(2);
	})

	it('Commenting on a certain post',function(){
		
		ctrl.addReply(1,'editreply');
		ctrl._resolveTestPromises()
		ctrl._resolveTestPromises()
		expect(ctrl.posts[0].replies[1].content).toBe('editreply')
	})


	it('Log out successfully', function() {
		ctrl.logout();
		ctrl._resolveTestPromises()
		expect(ctrl.posts[0].imageurl).toBe(undefined);

	})

	it('Filtering the posts', function() {
		expect(ctrl.searchKeyword()).toBe('');
		expect(ctrl.posts.length).toBe(1);

	})

	it('Edit the user status', function() {
		ctrl.editStatus();
		expect(ctrl.status).toBe('Happy');

	})

})