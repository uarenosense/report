var q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reportSchema = new Schema({
    userId:String,
    time:Number,
    groupId:String,
    tasks:[{content:String, time:Number}]
});
//set option
reportSchema.set('collection', 'report');
reportSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = mongoose.model('Report', reportSchema);
