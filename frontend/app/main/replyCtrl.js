(function() {
	angular.module('App')
		.controller('replyController', replyController);

	replyController.$inject = ['postService'];

	function replyController(postService) {
		var replyCtrl = this;
		replyCtrl.editReplyContent = "";
		replyCtrl.postid = "";
		replyCtrl.replyid = "";
		replyCtrl.isEdit = false;

		replyCtrl.editReply = editReply;

		replyCtrl.keydown = keydown;

		//edit a certain reply posted by the loggedinuser
		function editReply(postid, replyid, replyContent) {
			replyCtrl.postid = postid;
			replyCtrl.replyid = replyid;
			replyCtrl.editReplyContent = replyContent;
			replyCtrl.isEdit = !replyCtrl.isEdit;
		}
		//catch the keyboard action
		function keydown($event, reply) {
			if ($event.keyCode == 13) {
				replyCtrl.isEdit = false;
				postService.updatePosts({"user":replyCtrl.postid, "body":replyCtrl.editReplyContent, "commentId":replyCtrl.replyid})
					.$promise.then(function (result) {
						reply.content = replyCtrl.editReplyContent;
					})
			}
		}
	}
})()

