var Group = require('../models/group.js');
var User = require('../models/user.js');
var Report = require('../models/report.js');
var security = require('../security.js');
module.exports.addRoutes = function(app){
    /**
     * 获取用户日报
     */
    app.get('/user/report/list', security.loginRequire, function(req, res){
        Report.find({userId:req.user.userId}).sort({time:'desc'}).exec()
            .then(function(list){
                res.json({
                    code:200,
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
    app.get('/user/report/delete', security.loginRequire, function(req, res){
        Report.findOneAndRemove({id:req.param.id})
            .then(function(report){
                res.json({
                    code:200
                });
            },function(){
                res.json({code:500});
            });
    });
};