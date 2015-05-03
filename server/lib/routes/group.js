var Group = require('../models/group.js');
var User = require('../models/user.js');
var security = require('../security.js');
module.exports.addRoutes = function(app){
    /**
     * 获取小组信息
     */
    app.get('/group/info', security.loginRequire, function(req, res){
        User.findById(req.user.userId).exec()
            .then(function(user){
                if(user.role=='leader'){
                    Group.findOne({leader:user.id}).exec()
                        .then(function(group){
                            if(!group) return Group.create({leader:user.id}).exec();
                            else return group;
                        })
                        .then(function(group){
                            res.json({code:200, group:group});
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

    });
    /**
     * 获取小组日报
     */
    app.get('/group/report', function(){

    });
};