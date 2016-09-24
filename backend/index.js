//set the MONGOLAB_URI
if (process.env.NODE_ENV !== "production") {
    require('dotenv').load()
}

var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var qs = require('querystring')
var cookieParser = require('cookie-parser')
//var session = require('express-session')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express()
app.use(logger('default'))
app.use(bodyParser.json({ limit:'10mb'}))
app.use(enableCORS)
//app.use(session({secret: '2a4d833a32ff36c90064975e894f07e9'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser());

require('./app_server/db.js')
require('./app_server/auth.js').setup(app)
require('./app_server/posts.js').setup(app)
require('./app_server/profile.js').setup(app)
require('./app_server/following.js').setup(app)


function enableCORS(req, res, next) {
    
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', 'https://lz44frontend.herokuapp.com');
        //res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
      	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,Location, X-Session-Id, Content-Length, X-Requested-With');
      	res.header('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
        	return res.sendStatus(200)
        }
    }
	next();
};

// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s', 
               server.address().address,
               server.address().port)
})
