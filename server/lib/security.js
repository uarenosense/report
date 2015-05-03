var passport = require('passport');
var Account = require('./models/account.js');
module.exports.initialize = function(){
    passport.use(Account.createStrategy());
};