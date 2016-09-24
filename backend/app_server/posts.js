var isLoggedIn = require('./auth.js').isLoggedIn
var Post = require('./model.js').Post
var Profile = require('./model.js').Profile
var id

var multer = require('multer')
var cloudinary = require('./cloudinary.js')

exports.setup=function(app){
    app.get('/', hello)
	app.get('/posts/:id*?',isLoggedIn, getPosts)
    app.put('/posts/:id',isLoggedIn, updatePosts )
	app.post('/post', isLoggedIn, multer().single('image'), addPost)
    init()
}

function init() {
    Post.count({}, function (err, count) {
        if (!err)
            id = count
    })
}
//get the posts for the loggedin user, by id, username or the list of username
function getPosts(req,res){
    var id = req.params.id
    if(id){
        if(!isNaN(id)){
            
            Post.find({ id: id }).exec(function(err, items) {
                    if(err){
                        res.sendStatus(400)
                    } else{
                        res.send({ posts: items})
                    }                   
            })
        }
        else{
            Post.find({author: id}).sort({date: -1}).exec(function(err, items) {
                if(items){
                    res.send({ posts: items})              
                }
                else{
                    res.sendStatus(400)
                } 
            })
        }
    }
    else {
        
        var list = [req.username]
        
        Profile.find({username: req.username}).exec(function(err, items) {

            if(items[0]){
                list = list.concat(items[0].following)
            }
            Post.find({author: {$in : list}}).limit(10).sort({date: -1}).exec(function(err, posts) {
                if(err){
                        res.sendStatus(400)
                    } else{
                        res.send({ posts: posts})
                    } 
                
            })
        
        })
    }
}

function hello(req, res) {
    res.send({'hello':'World'})
}

function addPost(req,res){
  
    if (req.file === undefined || req.file.buffer === undefined) {
        var newPost = {'id':id, 'body':req.body.body, 'author':req.username, 'date':new Date(), 'comments':[]};
        var post = new Post(newPost)
        post.save(function(error) {
            if (error)
                res.sendStatus(400).end()
            else {
                id++
                res.send({'posts': [newPost]}).end();
            }
        })
    }
    else {
        var callback = function(require, result, image) {
            var newPost = {'id':id, 'body':require.body.body, 'author':require.username, 'date':new Date(), 'comments':[], 'img':image.url};
            var post = new Post(newPost)
            post.save(function(error) {
                if (error)
                    result.sendStatus(400).end()
                else {
                    id++
                    result.send({'posts': [newPost]}).end();
                }
            })
        }

        cloudinary.putImage(req, res, callback)
    }
}

//add new post with unique id
function updatePosts(req, res) {
        if (req.body.commentId === undefined) {
        var id = req.params.id
        Post.update({id: id}, {body: req.body.body}, function(err, posts) {
            Post.find({id: id}).exec(function(err, post) {
                res.send({posts: post})
            })
        })
    }
    else if (req.body.commentId == -1) {
        var id = req.params.id
        Post.find({id: id}).exec(function(err, posts) {
           
                var comments = posts[0].comments
                comments.push({commentId: comments.length, author: req.username, body: req.body.body, date: new Date()})
                Post.update({id: id}, {comments: comments}, function(error, post) {                    
                    res.send({posts: posts})
                })
        })
    }
    else {
        var id = req.params.id
        Post.find({id: id}).exec(function(err, posts) {
            var comments = posts[0].comments
            for (var i = 0; i < comments.length; i++) {
               if (comments[i].commentId == req.body.commentId) {
                    comments[i].body = req.body.body
                    Post.update({id: id}, {comments: comments}, function(error, post) {
                            res.send({posts: posts})
                    })
                    break
                }
            }
        
        })
    }

}
