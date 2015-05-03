var Account = require('../models/account.js');
var User = require('../models/user.js');
var passport = require('passport');
var security = require('../security.js');
module.exports.addRoutes = function(app){
    /**
     * 用户登录
     */
    app.post('/user/login',function(req, res, next){
        passport.authenticate('local', onAuth)(req, res, next);
        function onAuth(error, account, info){
            if(account){
                req.login(account, function(error){
                    if(error){
                        res.json({code:500});
                    }else{
                        User.findById(account.userId, onFind);
                    }
                });
            }else if(!error){
                res.json({code:401,message:'用户名或密码错误'});
            }else{
                res.json({code:500});
            }
        };
        function onFind(error, user){
            if(error){
                res.json({code:500});
            }else{
                res.json({code:200, user:user});
            }
        }
    });
    /**
     * 退出
     */
    app.post('/user/logout', function(req, res){
        req.logout();
        res.json({code:200});
    });
    /**
     * 注册
     */
    app.post('/user/register', function(req, res, next){
        var _param = req.body;
        if(!_param.username||!_param.password||!_param.name){
            res.json({code:'400'});
        }else{
            var user = new User({name:_param.name});
            user.save(onSave)
            ////////////////////functions///////////////////////
            function onSave(error){
                if(error){
                    req.json({code:500});
                }else{
                    _param.userId = user.get('id');
                    Account.register(_param, _param.password, onRegister);
                }
            };
            function onRegister(error, account){
                if(error){
                    res.json({code:500});
                }else{
                    passport.authenticate('local', onAuth)(req, res, next);
                }
            };
            function onAuth(error, account, info){
                req.login(account, function(error){
                    if(error){
                        res.json({code:500});
                    }else{
                        res.json({user:user});
                    }
                });
            }

        }
    });
    /**
     * 获取用户列表
     */
    app.get('/user/list', security.adminRequire, function(req, res){
        debugger
    });
    /**
     * 删除用户
     */
    app.get('/user/delete', function(req, res){

    });
    /**
     * 更新用户角色
     */
    app.get('/user/update/role', function(req, res){

    });
};