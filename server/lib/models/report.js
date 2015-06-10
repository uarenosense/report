var q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reportSchema = new Schema({
    userId:String,
    day:String,
    time:Number,
    groupId:String,
    tasks:[{content:String, time:Number}]
});
//set option
reportSchema.set('collection', 'reports');
reportSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = mongoose.model('Report', reportSchema);
