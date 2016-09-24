describe('App', function() {
	'use strict'

	var urlChanged = function(url) {
  		return function () {
    		return browser.getCurrentUrl().then(function(actualUrl) {
      			return url === actualUrl;
    		});
  		};
	};

	beforeEach(function() {
		browser.get('/index.html')
	})


	it('should register new user', function() {
		element(by.model('loginCtrl.username')).sendKeys('liangyu');
		element(by.model('loginCtrl.email')).sendKeys('lz44@rice.edu');
		element(by.model('loginCtrl.zipcode')).sendKeys('77005');
		element(by.model('loginCtrl.password')).sendKeys('123');
		element(by.model('loginCtrl.passwordConfirm')).sendKeys('123');
		element(by.buttonText('Register')).click();
		expect(element(by.className('registerMsg')).isDisplayed()).toBeTruthy();
	})

	function login(){
		element(by.model('loginCtrl.login_username')).sendKeys('lz44test');
		element(by.model('loginCtrl.login_password')).sendKeys('length-butter-fierce');
		element(by.buttonText('Login')).click();
	}

	it('should log in as a test user', function() {
		login()
		expect(browser.getCurrentUrl()).toBe("http://localhost:8080/index.html#/main");
	})

	it('Create a new post and validate the post appears in feed', function() {
		//login()

    	element(by.model('mainCtrl.postContent')).sendKeys('add new post');
		element(by.buttonText('Post')).click();
		expect(element(by.repeater('post in mainCtrl.posts').row(0).column('post.content')).getText()).toBe('add new post');
	})
	
	it('Update status headline and verify change', function() {
		//login()

		element(by.model('mainCtrl.newStatus')).sendKeys('new status');
		element(by.buttonText('Editstatus')).click();
		expect(element(by.id('status')).getText()).toBe('new status');
	})

	it('Add the Follower user and verify count increases by one', function() {
		//login()

		element.all(by.repeater('followingUser in followCtrl.followingUsers')).count().then(function(originalCount) {
			element(by.model('followCtrl.newFollower')).sendKeys('yz90');
			element(by.id('addFollowBtn')).click();
			expect(element.all(by.repeater('followingUser in followCtrl.followingUsers')).count()).toEqual(originalCount + 1);
		});
	})

	it('Remove the Follower user and verify count decrease by one', function() {

		element.all(by.repeater('followingUser in followCtrl.followingUsers')).count().then(function(originalCount) {
			element.all(by.repeater('followingUser in followCtrl.followingUsers')).get(0).element(by.id("deleteBtn")).click();

			//element(by.id('deleteBtn')).click();
			expect(element.all(by.repeater('followingUser in followCtrl.followingUsers')).count()).toEqual(originalCount - 1);
		});
	})

	it('search for post and verify only one post shows, and verify the author', function() {
		//login()

		element(by.model('mainCtrl.searchKeyword')).sendKeys('Only One Post Like This',protractor.Key.ENTER);
		expect(element(by.repeater('post in mainCtrl.posts').row(0).column('post.person.name')).getText()).toBe('lz44test');
	})

	it('should navigate to the profile view and verify the page is loaded', function() {
		
		element(by.buttonText('Profile')).click();
		expect(browser.getCurrentUrl()).toBe("http://localhost:8080/index.html#/profile");
	})
	
	 it('Update user email and verify', function() {
	 	element(by.buttonText('Profile')).click();
	 	browser.sleep(1000);
	 	element(by.model('profileCtrl.newemail')).sendKeys('111@rice.edu');
    	element(by.buttonText('Save Changes')).click();   	
     	//expect(element(by.model('profileCtrl.email'))).toBe('111@rice.edu');
     	var elm = element(by.id("profile-email"));
		expect(elm.getText()).toEqual("111@rice.edu");
	 })

	 it('Update user zipcode and verify', function() {
	 	element(by.buttonText('Profile')).click();
	 	browser.sleep(1000);
	 	element(by.model('profileCtrl.newzipcode')).sendKeys('11111');
    	element(by.buttonText('Save Changes')).click();   	
     	//expect(element(by.model('profileCtrl.email'))).toBe('111@rice.edu');
     	var elm = element(by.id("profile-zipcode"));
		expect(elm.getText()).toEqual("11111");
	 })

	 it('Update user password and verify', function() {
	 	element(by.buttonText('Profile')).click();
	 	browser.sleep(1000);
	 	element(by.model('profileCtrl.newpassword')).sendKeys('111');
    	element(by.buttonText('Save Changes')).click();   	
     	//expect(element(by.model('profileCtrl.email'))).toBe('111@rice.edu');
     	var elm = element(by.id("profile-password"));
		expect(elm.getText()).toEqual("will not change");
	 })

})

