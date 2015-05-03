var passport = require('passport');
var Account = require('./models/account.js');
var config = require('../config.js');
function initialize(){
    passport.use(Account.createStrategy());
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());
};

function loginRequire(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.json({code:401, message:'未登录'});
    }
};

function adminRequire(req, res, next){
    loginRequire(req, res, function(){
        if(config.security.admins.indexOf(req.user.username)!=-1){
            next();
        }else{
            res.json({code:401, message:'不是管理员'});
        }
    });
};
module.exports.initialize = initialize;
module.exports.loginRequire = loginRequire;
module.exports.adminRequire = adminRequire;