var q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name:String,
    role:{ type: String, default: 'normal' ,enum: ['normal', 'leader']}
});
//set option
userSchema.set('collection', 'user');
userSchema.set('_id', false);
/**
 * **************************************
 * static methods
 * **************************************
 */


module.exports = mongoose.model('User', userSchema);
