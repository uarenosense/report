var q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name:String
});
//set option
userSchema.set('collection','user');
/**
 * **************************************
 * static methods
 * **************************************
 */
userSchema.statics.getById = function(id){
    var deferred = q.defer();
    this.findById(id, function(err, user){
        if(err) deferred.reject(err);
        else deferred.resolve(user);
    });
    return deferred.promise;
};

module.exports = mongoose.model('User', userSchema);
