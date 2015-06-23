angular.module('app.my', ['app.directives.list.box'])
    .controller('AddReport', ['$scope', '$modalInstance', 'report', function($scope, $modalInstance, report){
        $scope.report = report||{tasks:[]};
        $scope.isAdd = !report;
        $scope.report.time = $scope.report.time||+ new Date;
        $scope.timeToggled = function(selected){
            $scope.report.time = selected.time;
        };
        $scope.add = function(){
            $scope.report.tasks.push({
                content:$scope.content,
                time:$scope.time
            });
            $scope.content = '';
            $scope.time = '';
        };
        $scope.delete = function(index){
            $scope.report.tasks.splice(index, 1);
        };
        $scope.ok = function(){
            if($scope.report.tasks.length) $modalInstance.close($scope.report);
            else $modalInstance.dismiss('cancel');
        };
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('TimeDropdown', ['$scope', '$filter', function ($scope, $filter) {
        var now = +new Date,
            day = 24*60*60*1000;
        $scope.items = [
            {text:'今天', time:now},
            {text:'昨天', time:(now-=day)},
            {text:'前天', time:(now-=day)},
            {text:$filter('date')(now-=day, 'yyyy-MM-dd'), time:now},
            {text:$filter('date')(now-=day, 'yyyy-MM-dd'), time:now},
            {text:$filter('date')(now-=day, 'yyyy-MM-dd'), time:now},
            {text:$filter('date')(now-=day, 'yyyy-MM-dd'), time:now},
            {text:$filter('date')(now-=day, 'yyyy-MM-dd'), time:now},
            {text:$filter('date')(now-=day, 'yyyy-MM-dd'), time:now}
        ];
        $scope.selected = $scope.items[0];

        $scope.status = {
            isopen: false
        };

        $scope.select = function(item){
            $scope.selected = item;
        };
    }])
    .controller('My', ['$scope', '$http', '$modal', '$filter', function($scope, $http, $modal, $filter){
        $scope.reports = [];
        $scope.user = window.USER;

        $scope.$watch('reports.length', function(length){
            if($scope.listBox){
                if(!length){
                    $scope.listBox.setState('empty');
                }else{
                    $scope.listBox.setState();
                }
            }
        });

        $scope.pageChange = function(data){
            $scope.listBox.setState('loading');
            $http.get('/report/api/user/report/list?'+jQuery.param(data))
                .success(function(data){
                    if(data.code==200){
                        if(data.reports&&data.reports.length){
                            $scope.reports = data.reports;
                            $scope.listBox.setState('success');
                            $scope.listBox.setTotal(data.count);
                        }
                    }else{
                        $scope.listBox.setState('error');
                    }
                })
                .error(function(){
                    $scope.listBox.setState('error');
                });
        };

        $scope.add = function(){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'main/my/add.report.tpl.html',
                controller: 'AddReport',
                resolve:{
                    report:null
                }
            });
            modalInstance.result.then(function (report) {
                report.day = $filter('date')(report.time, 'yyyy-MM-dd');
                $http.post('/report/api/user/report/add', report)
                    .success(function(data){
                        if(data.code==200){
                            report.id = data.id;
                            report.userId = window.USER._id;
                            $scope.reports.unshift(report);
                        }else{
                            alert(data.message||'添加失败');
                        }
                    });
            }, function () {
                console.log('dismissed');
            });
        };

        $scope.edit = function(report){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'main/my/add.report.tpl.html',
                controller: 'AddReport',
                resolve:{
                    report:function(){
                        return JSON.parse(JSON.stringify(report));
                    }
                }
            });
            modalInstance.result.then(function (draftReport) {
                $http.post('/report/api/user/report/update', {id:draftReport.id, tasks:draftReport.tasks})
                    .success(function(data){
                        if(data.code==200){
                            report.tasks = draftReport.tasks;
                        }else{
                            alert('操作失败');
                        }
                    });
            }, function () {
                console.log('dismissed');
            });
        };

        $scope.delete = function(index){
            if(!window.confirm('确定删除日报？')) return;
            $http.get('/report/api/user/report/delete?id='+$scope.reports[index].id)
                .success(function(data){
                    if(data.code==200){
                        $scope.reports.splice(index, 1);
                    }
                });
        };

        $scope.send = function(report){
            if(!window.confirm('确定发送日报？')) return;
            $http.get('/report/api/user/report/send?'+jQuery.param({id:report.id, userId:report.userId}))
                .success(function(data){
                    if(data.code==200){
                        report.groupId = data.groupId;
                    }else{
                        alert(data.message);
                    }
                })
        };
    }]);