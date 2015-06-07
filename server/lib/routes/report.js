var Group = require('../models/group.js');
var User = require('../models/user.js');
var Report = require('../models/report.js');
var security = require('../security.js');
var q = require('q');
module.exports.addRoutes = function(app){
    /**
     * 获取用户日报
     */
    app.get('/user/report/list', security.loginRequire, function(req, res){
        var query = req.query;
        q.all([
            Report.count({userId:req.user.userId}).exec(),
            Report.find({userId:req.user.userId}).sort({time:'desc'}).skip(query.offset||0).limit(query.limit||20).exec()
        ])
        .spread(function(count, list){
            res.json({
                code:200,
                count:count,
                reports:list
            });
        }, function(){
            res.json({
                code:500
            })
        });
    });
    /**
     * 添加用户日报
     */
    app.post('/user/report/add', security.loginRequire, function(req, res){
        var report = req.body;
        report.userId = req.user.userId;
        Report.create(report)
            .then(function(report){
                res.json({
                    code:200,
                    id:report.id
                });
            },function(){
                res.json({code:500});
            });
    });
    /**
     * 更新用户日报
     */
    app.post('/user/report/update', security.loginRequire, function(req, res){
        var report = req.body;
        Report.findOneAndUpdate(report)
            .then(function(report){
                res.json({
                    code:200
                });
            },function(){
                res.json({code:500});
            });
    });
    /**
     * 发送用户日报
     */
    app.get('/user/report/send', security.loginRequire, function(req, res){
        var groupId;
        User.findById(req.query.userId)
            .then(function(user){
                if(!user.groupId) throw Error();
                groupId = user.groupId;
                return Report.findByIdAndUpdate(req.query.id, {groupId:user.groupId}).exec();
            })
            .then(function(report){
                res.json({
                    code:200,
                    groupId:groupId
                });
            },function(error){
                res.json({code:500});
            });
    });
};