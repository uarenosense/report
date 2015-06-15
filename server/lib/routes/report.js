var Group = require('../models/group.js');
var User = require('../models/user.js');
var Report = require('../models/report.js');
var security = require('../security.js');
var q = require('q');
var config = require('../../config.js');
var mailer = require('nodemailer');
var transporter = mailer.createTransport(config.mail);
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
        Report.find({day:report.day, userId:report.userId}).exec()
            .then(function(oldReport){
                if(!oldReport||!oldReport.length){
                    Report.create(report)
                        .then(function(report){
                            res.json({
                                code:200,
                                id:report.id
                            });
                        },function(error){
                            res.json({code:500});
                        });
                }else{
                    res.json({code:500, message:'当天日报已存在'});
                }
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
        var rp = req.body;
        Report.findById(rp.id)
            .then(function(report){
                report.tasks = rp.tasks;
                report.markModified();
                return report.save();
            })
            .then(function(report){
                res.json({
                    code:200
                });
            },function(error){
                console.log(error.message);
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
                if(!user.groupId) throw {code:'505'};
                groupId = user.groupId;
                return Report.findByIdAndUpdate(req.query.id, {groupId:user.groupId}).exec();
            })
            .then(function(report){
                res.json({
                    code:200,
                    groupId:groupId
                });
            },function(error){
                var emap = {505:'暂无小组'};
                res.json({code:500, message:emap[error.code]||'发送失败'});
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
                            var promise1 =  Report.aggregate()
                                .match({groupId:group.id})
                                .group({_id:'$day', time:{$first:'$time'},reports:{$push:'$$ROOT'}})
                                .sort({time:'desc'})
                                .skip(parseInt(query.offset))
                                .limit(parseInt(query.limit))
                                .exec();
                            var promise2 = User.find({groupId:group.id})
                                .exec();
                            return q.all([promise1, promise2]).spread(function(groupReports, users){
                                groupReports.forEach(function(dayReport){
                                    var map = {};
                                    dayReport.reports.forEach(function(report){
                                        map[report.userId] = report;
                                    });
                                    dayReport.reports = users.map(function(user){
                                        var report = map[user.id]||{};
                                        report.user = user;
                                        delete report.userId;
                                        return report;
                                    });
                                });
                                return groupReports;
                            });
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
    /**
     * 打回日报
     */
    app.get('/user/report/sendBack', security.loginRequire, function(req, res){
        Report.findByIdAndUpdate(req.query.reportId, {groupId:''})
            .then(function(report){
                res.json({
                    code:200
                });
            },function(error){
                console.log(error.message);
                res.json({code:500});
            });
    });
    /**
     * 邮件发送小组日报
     */
    app.post('/group/report/mail', security.loginRequire, function(req, res){
        transporter.sendMail({
            from: config.mail.auth.user,
            cc: req.body.to,
            subject: req.body.subject,
            html: req.body.content
        }, function(error, info){
            if(error) {
                console.log(error);
                res.json({code:500});
            }else{
                res.json({code:200});
            }
        });
    });
    /**
     * 标记休假
     */
    app.post('/mark/rest', security.loginRequire, function(req, res){
        Report.create(req.body)
            .then(function(report){
                res.json({
                    code:200,
                    report:report
                });
            },function(error){
                console.log(error.message);
                res.json({code:500});
            });
    });
};