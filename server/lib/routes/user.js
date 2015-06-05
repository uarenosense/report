var Account = require('../models/account.js');
var User = require('../models/user.js');
var passport = require('passport');
var security = require('../security.js');
var q = require('q');
module.exports.addRoutes = function(app){
    /**
     * 用户登录
     */
    app.post('/user/login',function(req, res, next){
        var accountTmp;
        passport.authenticate('local', onAuth)(req, res, next);
        function onAuth(error, account, info){
            if(account){
                accountTmp = account;
                req.login(account, function(error){
                    if(error){
                        res.json({code:500});
                    }else{
                        if(req.body.remember) req.sessionOptions.maxAge = 5*24*3600*100;
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
                var userObj = user.toObject();
                userObj.admin = accountTmp.admin;
                res.json({code:200, user:userObj});
            }
        }
    });
    /**
     * 退出
     */
    app.get('/user/logout', function(req, res){
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
                    res.json({code:500, message:error.message.indexOf('userExistsError')!=-1?'该用户已注册':''});
                }else{
                    passport.authenticate('local', onAuth)(req, res, next);
                }
            };
            function onAuth(error, account, info){
                req.login(account, function(error){
                    if(error){
                        res.json({code:500});
                    }else{
                        var userObj = user.toObject();
                        userObj.admin = account.admin;
                        res.json({code:200,user:userObj});
                    }
                });
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
     * 获取登录用户
     */
    app.get('/user/login/get', security.loginRequire,function(req, res, next){
        User.findById(req.user.userId).exec()
            .then(function(user){
                var userObj = user.toObject();
                userObj.admin = req.user.admin;
                res.json({
                    code:200,
                    user:userObj
                });
            }, function(){
                res.json({
                    code:500
                });
            });
    });
    /**
     * 获取用户列表
     */
    app.get('/user/list', security.adminRequire, function(req, res){
        var query = req.query,
            result = {};
        q.all([
            User.find({}).skip(query.offset||0).limit(query.limit||20).exec(),
            User.count().exec()
        ])
            .spread(function(users, count){
                var ids = users.map(function(user){
                    return user.id;
                });
                result.users = users;
                result.count = count;
                return Account.find({userId:{'$in':ids}}).exec();
            })
            .then(function(accounts){
                var _map = {};
                accounts.forEach(function(account){
                    _map[account.userId] = account;
                });
                result.users = result.users.map(function(item){
                    var account = _map[item.id],
                        user = {
                            id:item.id,
                            name:item.name,
                            role:item.role
                        };
                    if(account){
                        user.username = account.username;
                    }
                    return user;
                });
                res.json(result);
            })
            .fail(function(error){
                res.json({code:500});
                console.error(error.message);
            });
    });
    /**
     * 获取用户列表
     */
    app.get('/user/search', security.adminRequire, function(req, res){
        var query = req.query,
            result = {};
        User.find({name:{$regex:query.name}}).exec()
            .then(function(users){
                result.code = 200;
                result.users = users;
                res.json(result);
            }, function(error){
                res.json({code:500});
                console.error(error.message);
            });
    });
    /**
     * 删除用户
     */
    app.get('/user/delete', security.adminRequire, function(req, res){
        var id = req.query.id;
        if(!id){
            res.json({code:400});
        }else{
            User.findByIdAndRemove(id).exec()
                .then(function(){
                    res.json({code:200});
                }, function(){
                    res.json({code:500})
                });
        }
    });
    /**
     * 更新用户角色
     */
    app.get('/user/update/role', security.adminRequire, function(req, res){
        var query = req.query;
        if(!query.id||!query.role){
            res.json({code:400});
        }else{
            User.findByIdAndUpdate(query.id, {role:query.role}).exec()
                .then(function(){
                    res.json({code:200});
                }, function(){
                    res.json({code:500});
                });
        }
    });
};