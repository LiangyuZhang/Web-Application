// this is auth.js 
exports.setup = function(app) {
    app.post('/login', login)
    app.put('/logout', isLoggedIn, logout)
    app.post('/register',register)
    app.put('/password',isLoggedIn,updatepassword)
    app.use(cookieParser())

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}))
    app.get('/callback', passport.authenticate('facebook', {
        failureRedirect: frontendURL
    }), function(req, res) {
        var sessionKey = md5("QWERTYUIOP" + new Date().getTime() + req.user.username)
        redis.set(sessionKey, req.user.username, function(err, res) {
            console.log(res)
        })
        res.cookie(cookieKey, sessionKey, {maxAge: 3600*1000, httpOnly: true})
        res.redirect(frontendURL)
    })
    app.get('/profile', isLoggedIn, profile)
    app.get('/fail', fail)
}
var Auth = require('./model.js').Auth
var User = require('./model.js').User
var Profile = require('./model.js').Profile
var cookieParser = require('cookie-parser')
var md5 = require('md5')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

//process.env.REDIS_URL = 'redis://h:p672ri8km3f0ubasvv143n1kpps@ec2-54-83-204-56.compute-1.amazonaws.com:13359'
var redis = require('redis').createClient(process.env.REDIS_URL)

var cookieKey = 'sid'

var frontendURL = 'https://lz44frontend.herokuapp.com'
//var frontendURL = 'http://localhost:8080'



exports.isLoggedIn = isLoggedIn
exports.cookieKey=cookieKey
exports.redis = redis
exports.md5 = md5

var users={};
var config = {
  clientSecret : '2a4d833a32ff36c90064975e894f07e9',
  clientID: '1593911974263462',
  callbackURL: 'https://lz44.herokuapp.com/callback'
  //callbackURL: 'http://localhost:3000/callback'
}



passport.serializeUser(function(user, done){
  
  users[user.id] = user
  done(null, user.id)
})

passport.deserializeUser(function(id, done){
  var user = users[id]
  done(null, user)
})
passport.use(new FacebookStrategy(config, 
  function(token, refreshToken, profile, done){
    process.nextTick(function() {

            Auth.findOne({ 'auth.linkUsername' : profile.displayName }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } 
            });
            User.findOne({ 'username' : profile.displayName }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isn't in our database, create a new user
                    var newProfile = new Profile({username: profile.displayName,
                        status: "Becoming a Web Developer",
                        following: ['lz44test'],
                        email: "",
                        zipcode: "",
                        picture: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQl2XkPZ52DF_kyoxU5rD5x8S6MmsPtcEDBfeoBjw5wSIX4lCLh"
                    })
                    newProfile.save(function(error) {
                        if (error)
                            console.log(error)
                    })

                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.username    = profile.displayName;
                    newUser.salt = "";
                    newUser.hash = "";
                    newUser.auth = []
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
    })
  })
)



function generateCode(username) {
    //var code = Math.random()
    var code = md5(username + "QQWERTYUIPOIUY")
    return code
}
//set the session for the loggedin user
function isLoggedIn(req, res, next) {

    var id = req.cookies[cookieKey]
   
    if(id){
        var username = redis.get(id, function(err, username) {
            if (username) {
                req.username = username
                next()
            }
            else {
                res.redirect(frontendURL)
            }
        })  
    }   
    else{
        res.redirect(frontendURL)
    }
} 

function fail(req, res){
    res.send('Failed', req.user)
}

function profile(req, res) {
    res.send('Ok', req.user)
}
//used to salt the password
function saltpass(password){
    return "QQWERTYUIPOIUY"+ password;
}
function hash(salt, username){
    return md5(salt+username)
}

function login(req, res){
    if (req.body == "" || !req.body.username || !req.body.password)
        res.sendStatus(400)

    var username=req.body.username;
    var password=req.body.password;
    var resalt = saltpass(password)
    var rehash = hash(resalt, username)

    User.find({ username: username }).exec(function(err, items) {
    
        if(items.length==0)
            res.sendStatus(400)
        else if(resalt !== items[0].salt || rehash !== items[0].hash){ 
            res.sendStatus(401)
        }
        else{
            var sessionKey = md5("QWERTYUIOP" + new Date().getTime() + username)
            redis.set(sessionKey, username, function(err, res) {
                console.log(res)
            })
            res.cookie(cookieKey, sessionKey, {maxAge: 3600*1000, httpOnly: true})           
            res.send({ username: username, result: "success"})
        }
    })
}

function logout(req,res){
    var id = req.cookies[cookieKey]
    redis.del(id)
    res.clearCookie(cookieKey)
    res.sendStatus(200).end()
}
    
//register for the new user
function register(req, res){
    var username=req.body.username;
    var password=req.body.password;
    var saltit = saltpass(password)
    var hashit = hash(saltit, username)
    //var auth = []
    
    User.find({ username: username }).exec(function(err, users) {
        if (users.length == 0) {
            
            var newUser = new User({ username: username, salt: saltit, hash: hashit, auth:[]}).save()

            var newProfile = new Profile({username: username,
                status: "Becoming a Web Developer",
                following: ['lz44test'],
                email: req.body.email,
                zipcode: req.body.zipcode,
                picture: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQl2XkPZ52DF_kyoxU5rD5x8S6MmsPtcEDBfeoBjw5wSIX4lCLh"
            }).save()

            res.send({username:username, result:'success'})
            
        }
        else {
            res.send({username: username, result:'failed'})
        }
    })
}
//update the password for the loggedin user
function updatepassword(req,res){
    var saltdone = saltpass(req.body.password)
    var hashdone = hash(saltdone,req.username) 

    User.update({username: req.username}, {salt: saltdone, hash: hashdone}, function(err, users) {
        if (err)
            res.sendStatus(400)
        else
            res.send({username:req.username, status:"success"})
    })
}



