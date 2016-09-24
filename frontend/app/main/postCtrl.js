(function() {
	angular.module('App')
		.controller('postController', postController);

	postController.$inject = ['postService'];

	function postController(postService) {
		var postCtrl = this;
		postCtrl.editPostContent = "";
		postCtrl.postid = "";
		postCtrl.isEdit = false;

		postCtrl.editPost = editPost;

		postCtrl.keydown = keydown;
		
		//edit a certain post posted by the loggedinuser
		function editPost(postid, postContent) {
			postCtrl.postid = postid;
			postCtrl.editPostContent = postContent;
			postCtrl.isEdit = !postCtrl.isEdit;
		}

		//catch the keyboard action
		function keydown($event, post) {
			if ($event.keyCode == 13) {
				postCtrl.isEdit = false;
				postService.updatePosts({"user":postCtrl.postid, "body":postCtrl.editPostContent})
					.$promise.then(function (result) {
						post.content = postCtrl.editPostContent;
					})
			}
		}

	}
})()

