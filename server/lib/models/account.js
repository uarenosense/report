var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var accountSchema = new Schema({
    userId:String
});
//set option
accountSchema.set('collection','account');
//plugin
accountSchema.plugin(passportLocalMongoose);
//exports
module.exports = mongoose.model('Account', accountSchema);
