describe('Post Controller Tests', function() {
	var helper
	var ctrl;
	var promises = []

	beforeEach(module('App'))	


	beforeEach(inject(function($controller, $rootScope, $q) {		
		helper=jasmine.helper
		helper.init($q)
 		ctrl = $controller('postController', {
			'postService':helper.mockPostService
		})
		ctrl._resolveTestPromises = function() {
			helper.resolveTestPromises($rootScope)
		}

	}))
	beforeEach(function(){
		ctrl._resolveTestPromises()
	})

	it('edit the post successfully', function() {
		ctrl.editPost(1,'editcontent')
		ctrl.keydown({'keyCode':'13'},ctrl)
		ctrl._resolveTestPromises()
		expect(ctrl.editPostContent).toBe('editcontent')
		ctrl.editPost(1,'editcontent')
		ctrl.keydown({'keyCode':'12'},ctrl)
		expect(ctrl.isEdit).toBe(true)

	})

})