var q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var groupSchema = new Schema({
    name:String,
    leader:String,
    members:[{userId:String}]
});
//set option
groupSchema.set('collection', 'group');

module.exports = mongoose.model('Group', groupSchema);
