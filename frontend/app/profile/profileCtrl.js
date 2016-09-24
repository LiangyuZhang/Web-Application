(function() {

	angular.module('App')
    .controller('ProfileController', ProfileController)

	ProfileController.$inject = [ 'userService','postService', '$location'];

	function ProfileController(userService, postService, $location){
		
		var profileCtrl = this
		profileCtrl.email =''
		profileCtrl.zipcode = ''
		profileCtrl.avatar = ''
		profileCtrl.username=''
		profileCtrl.status=''
		profileCtrl.password=''
		profileCtrl.newemail=''
		profileCtrl.newzipcode=''
		profileCtrl.newpassword=''
		profileCtrl.passwordstatus=''


		profileCtrl.changePic=changePic;
		profileCtrl.updateProfile=updateProfile;
		profileCtrl.gotoMainPage=gotoMainPage;
	

		userService.loggedInUser({}).$promise.then(function (result) {
    		var statuses= result.statuses;
    		profileCtrl.username=statuses[0].username
    		profileCtrl.status=statuses[0].status
  		});
		
		
		

		postService.getEmail({user:profileCtrl.username}).$promise.then(function(result){
			profileCtrl.email = result.email
			
		});

		postService.getZipcode({user:profileCtrl.username}).$promise.then(function(result){
			profileCtrl.zipcode = result.zipcode;
			
		})
		postService.getPic({user:profileCtrl.username}).$promise.then(function (result) {
        	profileCtrl.avatar=result.pictures[0].picture
  		});

  		
		//change the picture of the loggedin user
		function changePic(file){
			profileCtrl.newPic=file.files[0];
			postService.uploadAvatar({ img: profileCtrl.newPic }).$promise.then(function(result) {
				profileCtrl.avatar = result.picture;
			});
		}
		//update the picture to the dummy server
		function updateProfile(){
			
			postService.updateEmail({email:profileCtrl.newemail}).$promise.then(function (result) {
        		profileCtrl.email=result.email
  			});

  			postService.updateZipcode({zipcode:profileCtrl.newzipcode}).$promise.then(function (result) {
        		profileCtrl.zipcode=result.zipcode
  			});
  			postService.updatePassword({password:profileCtrl.newpassword}).$promise.then(function (result) {
        		profileCtrl.passwordstatus=result.status
  			});

		}
		//go back to the main page without log in
		function gotoMainPage(){
			$location.path('main');
		}
		
	}

})()