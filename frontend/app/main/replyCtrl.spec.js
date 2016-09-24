describe('Reply Controller Tests', function() {
	var helper
	var ctrl;
	var promises = []

	beforeEach(module('App'))	

	beforeEach(inject(function($controller, $rootScope, $q) {		
		helper=jasmine.helper
		helper.init($q)
 		ctrl = $controller('replyController', {
			
			'postService':helper.mockPostService,
			'userService':helper.mockUserService
		})
		ctrl._resolveTestPromises = function() {
			helper.resolveTestPromises($rootScope)
		}
	}))
	beforeEach(function(){
		ctrl._resolveTestPromises()
	})

	it('Adding a new reply', function() {
		
		ctrl.editReply(1,1,'newreply');
		ctrl._resolveTestPromises()
		ctrl._resolveTestPromises()
		expect(ctrl.editReplyContent).toBe('newreply');
	})

	it('Editing a comment', function() {
		
		ctrl.editReply(1,1,'editreply');
		ctrl.keydown({'keyCode':'13'},ctrl)
		ctrl._resolveTestPromises()
		ctrl._resolveTestPromises()
		expect(ctrl.editReplyContent).toBe('editreply');
		ctrl.editReply(1,1,'editreply');
		ctrl.keydown({'keyCode':'12'},ctrl)
		expect(ctrl.isEdit).toBe(true)
	})

})