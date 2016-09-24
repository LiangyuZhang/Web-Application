describe('Login Controller Tests', function() {
	var helper
	var ctrl;
	var promises = []

	beforeEach(module('App'))	

	beforeEach(inject(function($controller, $rootScope, $q) {		
		helper=jasmine.helper
		helper.init($q)
 		ctrl = $controller('loginController', {
			'loginService': helper.mockLoginService,
			'userService':helper.mockUserService

		})
		ctrl._resolveTestPromises = function() {
			helper.resolveTestPromises($rootScope)
		}
	}))

	beforeEach(function(){
		ctrl._resolveTestPromises()
	})

	it('Log in successfully', function() {
		ctrl.username = "lz44";
		ctrl.password = "111";
		ctrl.login();
		ctrl._resolveTestPromises()

		expect(ctrl.errormsg).toBe(true);

	})

	it('Failed to log in with wrong password', function() {
		ctrl.username = "lz44";
		ctrl.password = "123";
		ctrl.login();
		ctrl._resolveTestPromises()
		expect(ctrl.errormsg).toBe(true);

	})

	it('Register a user, perform information check', function() {

		ctrl.username = "lz44"
		ctrl.isValid();
		expect(ctrl.nameerr).toBe(false)

		ctrl.username = " "
		ctrl.isValid();
		expect(ctrl.nameerr).toBe(true)

		ctrl.zipcode = "77005"
		ctrl.isValid();
		expect(ctrl.ziperr).toBe(false)

		ctrl.zipcode = "770055"
		ctrl.isValid();
		expect(ctrl.ziperr).toBe(true)

		ctrl.email = "11@rice.edu"
		ctrl.isValid();
		expect(ctrl.emailerr).toBe(false)

		ctrl.email = "111"
		ctrl.isValid();
		expect(ctrl.emailerr).toBe(true)

		ctrl.password = "12345"
		ctrl.cpassword ="12345"
		ctrl.isValid();
		expect(ctrl.pwderr).toBe(true)

		ctrl.password = "12345"
		ctrl.cpassword = "111"
		ctrl.isValid();
		expect(ctrl.pwderr).toBe(true)

	})

	it('should share the username between controllers', inject(function($controller, nameService) {
		var testCtrl = $controller('TestCtrl', { nameService })
		expect(ctrl.getUsername()).toBe(testCtrl.getUsername())
	}))


})