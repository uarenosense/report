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
            },function(error){
                var emap = {11000:'当天日报已存在'};
                res.json({code:500,message:emap[error.code]});
            });
    });
    /**
     * 删除用户日报
     */
    app.get('/user/report/delete', security.loginRequire, function(req, res){
        Report.findByIdAndRemove(req.query.id).exec()
            .then(function(){
                res.json({
                    code:200
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
    /**
     * 获取小组日报
     */
    app.get('/group/report/list', security.loginRequire, function(req, res){
        var query = req.query;
        User.findById(req.user.userId).exec()
            .then(function(user){
                if(user.role=='leader'){
                    Group.findOne({leader:user.id}).exec()
                        .then(function(group){
                            return Report.aggregate()
                                .match({groupId:group.id})
                                .group({_id:'$day', reports:{$push:'$$ROOT'}})
                                .sort({time:'desc'})
                                .skip(parseInt(query.offset))
                                .limit(parseInt(query.limit))
                                .exec();
                        })
                        .then(function(list){
                            Report.aggregate()
                                .group({_id:'$day'})
                                .exec()
                                .then(function(count){
                                    res.json({
                                        code:200,
                                        reports:list,
                                        count:count.length
                                    });

                                }, function(error){
                                    console.log(error.message);
                                });
                        }, function(error){
                            console.log(error.message);
                            res.json({
                                code:500
                            });
                        });
                }else{
                    res.json({code:401, message:'不是组长'})
                }
            }, function(){
                res.json({code:500})
            });
    });
};