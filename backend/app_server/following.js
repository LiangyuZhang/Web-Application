// this is following.js 
exports.setup = function(app) {
    var isLoggedIn = require('./auth.js').isLoggedIn
    app.get('/following/:user*?', isLoggedIn,getFollowing)
    app.put('/following/:user', isLoggedIn,updateFollowing)
    app.delete('/following/:user',isLoggedIn,deleteFollowing)
}
var Profile = require('./model.js').Profile
var User = require('./model.js').User

//get the following for the loggedin user
function getFollowing(req, res){
    var username
    if (req.params.user)
        username = req.params.user
    else
        username = req.username
    
    Profile.find({username: username}).exec(function(err, items) {
        
        res.send({username:items[0].username, following:items[0].following})
    })
}
//add the following
function updateFollowing(req,res){

    Profile.find({username: req.username}).exec(function(err0, items) {

            var following = items[0].following

            User.find({username: req.params.user}).exec(function(err1, users) {

                if (users.length == 0)
                    res.send({username:items[0].username, following:items[0].following})
                else {
                    following.push(users[0].username)
                    Profile.update({username: req.username}, {following: following}, function(err2, users2) {
                        
                        res.send({username:req.username, following:following})
                    })
                }
            })
        
    })
}
//delete the following
function deleteFollowing(req, res){

    Profile.find({username: req.username}).exec(function(err, items) {
            var following = items[0].following
            var index = following.indexOf(req.params.user)
            following.splice(index, 1)
            Profile.update({username: req.username}, {following: following}, function(err1, users) {
                res.send({username:req.username, following:following})
            })
    })
}