var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var passport = require('passport');
var config = require('./config.js');
var app = express();
var server = http.createServer(app);
var mongoose = require('mongoose');
var security = require('./lib/security.js');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret:config.server.secret}));
app.use(passport.initialize());
app.use(passport.session());
//security
security.initialize();
//resists routes
var routes = ['static.js', 'user.js', 'report.js', 'group.js'];
routes.forEach(function(route){
    require('./lib/routes/'+route).addRoutes(app, config);
});
//connect to db
mongoose.connect(config.db.url);

server.listen(config.server.listenPort, '0.0.0.0', 511, function() {
    console.log('Report app server startup success!');
});