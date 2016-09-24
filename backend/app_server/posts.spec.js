/*
 * Test suite for posts.js
 */
var request = require('request')
var post = require('./posts.js')
var postId=''

function url(path) {
	return "http://localhost:3000" + path
	//return "http://webdev-dummy.herokuapp.com"+path
}

describe('Validate Post Functionality', function() {
	var num;

	it('should give me three posts', function(done) {
		//console.log("aaa")
		request({url: url("/posts"), method: 'GET'}, function(err, res, body){
			//console.log("in the request")
			//expect(res.statusCode).toBe(200);	
			var postContent=JSON.parse(body)		
			expect(postContent.posts.length).not.toBeLessThan(3);
			done()
		})

 	}, 500)//the amount of time the test wait for


	it('should add two posts with successive post ids, and return the post each time', function(done) {
		// add a new post /Post post with payload
		// verify you get the post back with an id
		// verify the content of the post
		// add a second post
		// verify the post id increases by one
		// verify the second post has the correct content
		request({url: url("/post"), method: 'POST', 
			json: {
    			author:'Leo',
    			body:"This is Leo's post"
    		}}, function(err, res, body){
			expect(res.statusCode).toBe(200);	
			postId=body.posts[0].id;
			expect(body.posts[0].body).toBe("This is Leo's post")
			done()
		})
		request({url: url("/post"), method: 'POST', 
			json: {
    			author:'Cris',
    			body:"The second post"
    		}}, function(err, res, body){
			expect(res.statusCode).toBe(200);	
			expect(body.posts[0].id).toBe(postId+1);
			expect(body.posts[0].body).toBe("The second post")
			done()
		})

 	}, 200)

	it('should return a post with a specified id', function(done) {
		// call GET /posts first to find an id, perhaps one at random
		// then call GET /posts/id with the chosen id
		// validate that only one post is returned
		request({url: url("/posts"), method: 'GET'}, function(err, res, body){
			//console.log("in the request")
			expect(res.statusCode).toBe(200);	
			var postContent=JSON.parse(body)		
			//expect(postContent.posts[0].id).not.toBeLessThan(3);
		 	num=postContent.posts[0].id
			done()
		})
		request({url: url("/posts/:1"), method: 'GET'}, function(err, res, body){
			//console.log("in the request")
			expect(res.statusCode).toBe(200);
			var cerPost=JSON.parse(body)	
			expect(cerPost.posts.length).toBe(1);
			done()
		})	
	}, 200)

	it('should return nothing for an invalid id', function(done) {
		// call GET /posts/id where id is not a valid post id, perhaps 0
		// confirm that you get no results
		request({url: url("/posts/:0"), method: 'GET'}, function(err, res, body){
			
			expect(res.statusCode).toBe(200);	
			var postContent=JSON.parse(body)
			expect(postContent.posts[0]).toBe(null);
			done()
		})
		done()
	}, 200)


});