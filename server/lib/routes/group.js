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
                            return User.find({'_id':{'$in':group.members}}).exec();
                        })
                        .then(function(members){
                            var list,query = {};
                            members.forEach(function(item){
                                query[item.id] = item;
                            });
                            list = groupInfo.members.map(function(item){
                                return query[item];
                            });
                            res.json({code:200, group:{id:groupInfo.id, name:groupInfo.name, members:list}});
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
     * 更新小组信息
     */
    app.get('/group/members/add', function(req, res){
        User.findById(req.user.userId).exec()
            .then(function(user){
                if(user.role=='leader'){
                    Group.findById(req.query.groupId).exec()
                        .then(function(group){
                            group.members.push(req.query.userId);
                            return group.save();
                        })
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
     * 更新小组信息
     */
    app.get('/group/members/delete', function(req, res){
        User.findById(req.user.userId).exec()
            .then(function(user){
                if(user.role=='leader'){
                    Group.findById(req.query.groupId).exec()
                        .then(function(group){
                            group.members.pull(req.query.userId);
                            return group.save();
                        })
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