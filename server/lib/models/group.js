var q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var groupSchema = new Schema({
    name:String,
    leader:String
});
//set option
groupSchema.set('collection', 'groups');
groupSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = mongoose.model('Group', groupSchema);
