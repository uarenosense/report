angular.module('app.group.report', ['app.directives.list.box'])
    .controller('GroupReport', ['$scope', '$http',function($scope, $http){
        $scope.pageChange = function(data){
            $scope.listBox.setState('loading');
            $http.get('/report/api/group/report/list?id='+jQuery.param(data))
                .success(function(data){
                    if(data.code==200){
                        if(data.reports&&data.reports.length){
                            $scope.reports = data.reports;
                            $scope.listBox.setTotal(data.count);
                            $scope.listBox.setState('success');
                        }else{
                            $scope.listBox.setState('empty');
                        }

                    }else{
                        $scope.listBox.setState('error');
                    }
                })
                .error(function(){
                    $scope.listBox.setState('error');
                });
        };

        $scope.sendBack = function(report){
            $http.get('/report/api/user/report/sendBack?reportId='+report._id)
                .success(function(data){
                    if(data.code==200){
                        report.tasks = null;
                    }else{
                        alert('操作失败');
                    }
                });
        };

        $scope.sendMail = function(rp){
            if(!window.confirm('确定邮件发送日报？')) return;
            $http.get('/report/api/group/info')
                .success(function(data){
                    if(data.code==200){
                        var subject = data.group.name+rp._id+'日报',
                            to = data.group.mails.concat(data.group.members.map(function(user){
                                return user.username;
                            })),
                            content = rp.reports.map(function(report){
                                var tasks = (report.tasks||[]).map(function(task){
                                    return '<li>'+task.content+' ('+task.time+'h)</li>';
                                });
                                return '<dl><strong>'+report.user.name+'</strong></dl><dt><ol>'+tasks.join('')+'</ol></dt>';
                            }).join('');
                        $http.post('/report/api/group/report/mail', {subject:subject, to:to, content:content})
                            .success(function(data){
                                if(data.code==200){
                                    alert('发送成功');
                                }else{
                                    alert('发送失败');
                                }
                            });
                    }else{
                        alert('小组信息获取失败');
                    }

                })
                .error(function(){
                    alert('小组信息获取失败');
                });
        };
    }]);