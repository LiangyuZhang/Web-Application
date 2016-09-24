// this is profile.js which contains all user profile 
// information except passwords which is in auth.js
exports.setup = function(app) {

    var isLoggedIn = require('./auth.js').isLoggedIn
    app.get('/statuses/:users*?', isLoggedIn, getStatuses)
    app.get('/status', isLoggedIn,getStatus)
    app.put('/status', isLoggedIn,updateStatus)
    app.get('/email/:user*?',isLoggedIn,getEmail)
    app.put('/email',isLoggedIn,updateEmail)
    app.get('/zipcode/:user*?',isLoggedIn,getZipcode)
    app.put('/zipcode',isLoggedIn,updateZipcode)
    app.get('/pictures/:user*?',isLoggedIn,getPictures)
    app.put('/picture',isLoggedIn,multer().single('image'), updatePictures)
    app.post('/linkAccount',isLoggedIn,linkAccount)
    app.post('/unlinkAccount',isLoggedIn,unlinkAccount)
}
var Profile = require('./model.js').Profile
var User = require('./model.js').User
//upload the picture part
var multer = require('multer')
var stream = require('stream')
var cloudinary = require('./cloudinary.js')

//change picture for the loggedin user
function updatePictures(req,res){
    var callback = function(require, result, image) {
        
        Profile.update({username: require.username}, {picture: image.url}, function(err, users) {
            if (err)
                result.sendStatus(400).end()
            else
                result.send({username: require.username, picture: image.url})
        })
    }

    cloudinary.putImage(req, res, callback)
}

function linkAccount(req,res){
    User.find({username: req.body.linkUsername}).exec(function(err, item) {
        item[0].auth.push({thirdparty: 'facebook', linkUsername: req.body.username})

        item[0].save(function(error) {
                if (error)
                    res.sendStatus(400).end()
                else {
                    res.send({ username: req.body.username, result: "success"})
                }
        })

    })

    User.remove({username: req.body.username}).exec(function(err){
        
        if(err){
            res.sendStatus(400).end()
        }
    })
}
//remove the third party account from local account
function unlinkAccount(req,res){
    User.find({username: req.body.username}).exec(function(err, item) {
        
        item[0].auth = [];
        item[0].save(function(error) {
                if (error)
                    res.sendStatus(400).end()
                else {
                    res.send({ username: req.body.username, result: "success"})
                }
        })
        })
}

//end up the picture part
//get status for the loggedin user
function getStatuses(req, res) {

    var username = req.params.users
    
    if(!username){
        username = req.username  
        Profile.find({ username: username }).exec(function(err, items) {  
            res.send({ statuses: [ 
                { username: items[0].username, status: items[0].status} 
            ] })
            
        })
    } else{
        var list
        list = req.params.users.split(',');
        var statuslist = []
        Profile.find({ username: {$in : list} }).exec(function(err, items) {
            items.forEach(function(item){
                statuslist.push({ username: item.username, status: item.status})
            })
            res.send({ statuses: statuslist }).end()
            
        })
    }
}
//get status for the loggedin user
function getStatus(req, res) {
    
    var username = req.params.user
    if(!username){
        username = req.username
    }

    Profile.find({ username: username }).exec(function(err, items) {
          
        res.send({ statuses: [ 
            { username: items[0].username, status: items[0].status} 
        ] })
    
    })
}
//change status for the loggedin user
function updateStatus(req, res){

    Profile.update({username: req.username}, {status: req.body.status}, function(err, items) {
        res.send({username:req.username, status:req.body.status}).end()
         
    })
}
//get email for the loggedin user
function getEmail(req,res){

    var username = req.params.user
    if(!username){
        username = req.username
    }

    Profile.find({username: username}).exec(function(err, items) {
        res.send({username:items[0].username, email:items[0].email}).end()
       
    })
}
//change email for the loggedin user
function updateEmail(req, res){
    Profile.update({username: req.username}, {email: req.body.email}, function(err, items) {
        res.send({username:req.username, email:req.body.email}).end()
       
    })
}
//get zipcode for the loggedin user
function getZipcode(req,res){
    var username = req.params.user
    if(!username){
        username = req.username
    }

    Profile.find({username: username}).exec(function(err, items) {
        res.send({username:items[0].username, zipcode:items[0].zipcode}).end()
       
    })
}
//change zipcode for the loggedin user
function updateZipcode(req,res){

    Profile.update({username: req.username}, {zipcode: req.body.zipcode}, function(err, items) {
            res.send({username:req.username, zipcode:req.body.zipcode}).end()
             
    })
}
//get picture for the loggedin user
function getPictures(req,res){
    var users
    if(!req.params.user){
        users = req.username
    } else{
        users = req.params.user.split(',');
    }
    Profile.find({username: {$in : users}}).select('-_id username picture').exec(function(err, items) {
     
        res.send({pictures:items}).end()

    })
}


