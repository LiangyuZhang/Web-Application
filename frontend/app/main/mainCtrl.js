(function() {

angular.module('App')
  .controller('mainController', mainController)
  

mainController.$inject = ['userService','postService','loginService','$location']

function mainController(userService,postService,loginService,$location) {
  var mainCtrl = this
  mainCtrl.posts=[]
  mainCtrl.username=''
  mainCtrl.status=''
  mainCtrl.avatar=''
  mainCtrl.postContent=''
  mainCtrl.postImage=''
  mainCtrl.logout =logout;
  mainCtrl.addPost = addPost;
  mainCtrl.addReply=addReply;
  
  mainCtrl.gotoProfile=gotoProfile;
  mainCtrl.editStatus=editStatus;
  mainCtrl.searchKeyword=searchKeyword;
  mainCtrl.setFile=setFile;

  function setFile(file){
    
    mainCtrl.postImage=file.files[0];
  }
  //get the logged in user information
  userService.loggedInUser({}).$promise.then(function (result) {
      var statuses= result.statuses;
      mainCtrl.username=statuses[0].username
      mainCtrl.status=statuses[0].status

  });
//get the user information from dummy server
  postService.getPic({user:mainCtrl.username}).$promise.then(function (result) {
        mainCtrl.avatar=result.pictures[0].picture
  });
    postService.getPosts({}).$promise.then(function (result) {
      var posts = result.posts;

      posts.forEach(function(e) {
          var person = new Person(e.author, "", "");
          postService.getPic({user : e.author}).$promise.then(function (result) {
                person.avatar=result.pictures[0].picture
              });
          var newPost = new Post(person, e.date, e.body);
          newPost.id = e.id;
          newPost.imageurl = e.img;
          //reply:author,date,body,commentId
          if (e.comments) {
            e.comments.forEach(function(comment) {
                var per=new Person(comment.author,"","")
                postService.getPic({user:comment.author}).$promise.then(function (result) {
                  per.avatar=result.pictures[0].picture
                });

                var reply = new Reply(per, comment.date, comment.body);
                reply.id = comment.commentId;
                newPost.replies.push(reply);
            })
          }
          mainCtrl.posts.push(newPost);
      });
  });

//update the loggedinuser status
function editStatus(){
  userService.updateStatus({status:mainCtrl.newStatus}).$promise.then(function (result) {
      
      mainCtrl.status=result.status
  });
}

//add post to server and shown on the main page
function addPost(){

// XXX was upload
  postService.addPost({body:mainCtrl.postContent, img:mainCtrl.postImage}).$promise.then(function (result) {
      var posts = result.posts[0];
      var person = new Person(mainCtrl.username,mainCtrl.avatar,"")
      var post= new Post(person, posts.date, posts.body)
      post.id=posts.id
      
      post.imageurl=result.posts[0].img
      mainCtrl.posts.unshift(post);

  });
}

//add reply to a certain post
function addReply(postid, replyContent){
  postService.getPic({user:mainCtrl.username}).$promise.then(function (result) {
                mainCtrl.avatar=result.pictures[0].picture
  });
  postService.addReply({user:postid ,body:replyContent, commentId:-1}).$promise.then(function (result) {
      
      var post = result.posts[0];
      mainCtrl.posts.forEach(function(e) {
          if (e.id == postid) {
              var person =new Person(mainCtrl.username,mainCtrl.avatar,"");
              var reply = new Reply(person, post.date, replyContent);
              reply.id = post.comments[post.comments.length - 1].commentId;
              e.replies.push(reply);
          }
      })

  });
}

//logout and redirect to the landing page
function logout(){ 
    loginService.logout({}).$promise.then(function (result) {
        $location.path('login');
    })
  }

//function used to test filtering
function searchKeyword(){
  mainCtrl.searchKeyword='';
  return mainCtrl.searchKeyword;
}

//redirect to the profile page
function gotoProfile(){
  $location.path('profile');   
  }

};


  
})();


