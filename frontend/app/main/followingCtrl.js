(function() {
	angular.module('App')
		.controller('followingController', followingController);

	followingController.$inject = ['postService'];

	function followingController(postService) {
		var followCtrl = this;

		followCtrl.userStatus=[];
		followCtrl.followingUsers=[];
		followCtrl.newFollower='';
		followCtrl.shownError=true;

		
		followCtrl.deleteFollowing=deleteFollowing;
		followCtrl.addFollowing=addFollowing;

		//function getFollowing(){
			postService.getFollowing().$promise.then(function (result) {
					
					var users= result.following;
					users.forEach(function(e){
						var person =new Person(e,"","");
						person.name=e;
						postService.getPic({user : e}).$promise.then(function (result) {
                			person.avatar=result.pictures[0].picture
              			});	
						postService.getStatuses({user:e}).$promise.then(function(result){
							person.status = result.statuses[0].status; 
					})
						followCtrl.followingUsers.push(person);
					})
  			})
		//}

		function deleteFollowing(name){
			postService.removeFollowing({user:name}).$promise.then(function(result){
				var index=0;
				for(var i=0; i<followCtrl.followingUsers.length; i++){
					if(followCtrl.followingUsers.name==name){
						index=i;
						break;
					}
				}
				followCtrl.followingUsers.splice(index,1);

			})
		}
		
		function addFollowing(){
			if(followCtrl.newFollower==""){
				followCtrl.shownError=false;
				followCtrl.newFollowMsg="Please enter a username";
				return;
			}

			var count = followCtrl.followingUsers.length;
			postService.newFollowing({user:followCtrl.newFollower}).$promise.then(function(result){
				if(result.following.length==count){
					followCtrl.shownError=false;
					followCtrl.newFollowMsg = "This user doesn't exist";
				}
				else{
					//find the new followers,name it newUserName
					var newListfollowing=result.following
					var newUserName=result.following.pop();
					var person =new Person(newUserName,"","");
						postService.getPic({user : newUserName}).$promise.then(function (result) {
                			person.avatar=result.pictures[0].picture
              			});	
						postService.getStatuses({user:newUserName}).$promise.then(function(result){
							person.status = result.statuses[0].status; 
					})
						followCtrl.followingUsers.push(person);
					followCtrl.shownError=true;
					followCtrl.newUserName = "";
				}
				
			})
		}
		
	}
})()

