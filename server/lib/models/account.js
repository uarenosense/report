var mongoose = require('mongoose');
var config = require('../../config.js');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var accountSchema = new Schema({
    userId:String
});
//set option
accountSchema.set('collection','accounts');
//plugin
accountSchema.plugin(passportLocalMongoose);
accountSchema.virtual('admin').get(function(){
    return config.security.admins.indexOf(this.username)!=-1;
});
//exports
module.exports = mongoose.model('Account', accountSchema);
