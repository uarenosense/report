var Group = require('../models/group.js');
var User = require('../models/user.js');
var security = require('../security.js');
module.exports.addRoutes = function(app){
    /**
     * 获取小组信息
     */
    app.get('/group/info', security.loginRequire, function(req, res){
        var groupInfo;
        User.findById(req.user.userId).exec()
            .then(function(user){
                if(user.role=='leader'){
                    Group.findOne({leader:user.id}).exec()
                        .then(function(group){
                            if(!group) return Group.create({leader:user.id, members:[user.id]}).exec();
                            else return group;
                        })
                        .then(function(group){
                            groupInfo = group;
                            return User.find({'groupId':group.id}).exec();
                        })
                        .then(function(members){
                            res.json({code:200, group:{id:groupInfo.id, name:groupInfo.name, members:members}});
                        }, function(){
                            res.json({code:500});
                        });
                }else{
                    res.json({code:401, message:'不是组长'})
                }
            }, function(){
                res.json({code:500})
            });
    });
    /**
     * 更新小组信息
     */
    app.post('/group/info/update', function(req, res){
        User.findById(req.user.userId).exec()
            .then(function(user){
                if(user.role=='leader'){
                    Group.findByIdAndUpdate(req.body.id ,req.body).exec()
                        .then(function(){
                            res.json({code:200});
                        }, function(){
                            res.json({code:500});
                        });
                }else{
                    res.json({code:401, message:'不是组长'})
                }
            }, function(){
                res.json({code:500})
            });
    });
    /**
     * 添加小组成员
     */
    app.get('/group/members/add', function(req, res){
        User.findById(req.user.userId).exec()
            .then(function(user){
                if(user.role=='leader'){
                    User.findByIdAndUpdate(req.query.userId, {groupId:req.query.groupId, groupName:req.query.groupName}).exec()
                        .then(function(){
                            res.json({code:200});
                        },function(){
                            res.json({code:500});
                        });
                }else{
                    res.json({code:401, message:'不是组长'})
                }
            }, function(){
                res.json({code:500})
            });
    });
    /**
     * 删除小组成员
     */
    app.get('/group/members/delete', function(req, res){
        User.findById(req.user.userId).exec()
            .then(function(user){
                if(user.role=='leader'){
                    User.findByIdAndUpdate(req.query.userId, {groupId:''}).exec()
                        .then(function(){
                            res.json({code:200});
                        },function(){
                            res.json({code:500});
                        });
                }else{
                    res.json({code:401, message:'不是组长'})
                }
            }, function(){
                res.json({code:500})
            });
    });
    /**
     * 获取小组日报
     */
    app.get('/group/report', function(){

    });
};