angular.module('app.my', ['app.directives.list.box'])
    .controller('AddReport', ['$scope', '$modalInstance', 'report', '$filter',function($scope, $modalInstance, report, $filter){
        $scope.report = report||{tasks:[]};
        $scope.isAdd = !report;
        $scope.report.time = $scope.report.time||+ new Date;
        $scope.canEditTime = ((+ new Date)-$scope.report.time)/(24*60*60*1000)<=8||$scope.isAdd;
        $scope.date = $filter('date')($scope.report.time, 'yyyy-MM-dd');
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
    .controller('TimeDropdown', ['$scope', '$filter', '$attrs',function ($scope, $filter, $attrs) {
        var now = +new Date,
            dayMS = 24*60*60*1000,
            map = {
                0:'今天',
                1:'昨天'
            },
            dayMap = {
                0:'星期天',
                1:'星期一',
                2:'星期二',
                3:'星期三',
                4:'星期四',
                5:'星期五',
                6:'星期六'
            },
            selected = $scope.$parent[$attrs.selected];
        $scope.items = [];

        for(var i=0;i<10;i++){
            var time = new Date(now-i*dayMS),
                date = $filter('date')(time, 'yyyy-MM-dd'),
                item = {text:map[i]||date, date:date, time:time.getTime(), day:dayMap[time.getDay()]};
            if(item.date==selected) $scope.selected = item;
            $scope.items.push(item);
        }
        $scope.selected = $scope.selected||$scope.items[0];

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
                backdrop:'static',
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
                backdrop:'static',
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