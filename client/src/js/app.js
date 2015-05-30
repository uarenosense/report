angular.module('app', ['ui.router', 'ui.bootstrap'])
    .controller('tab', ['$scope', '$location', function($scope, $location){
        $scope.checkActive = function(reg){
            return new RegExp(reg).test($location.path())?'active':'';
        };
    }])
    .controller('accounts', ['$scope', '$http', function($scope, $http){
        $http.get('/user/list')
            .success(function(data){
                $scope.users = data.users;
            });
        $scope.delete = function(user){
            $http.get('/user/delete?id='+user.id)
                .success(function(data){
                    if(data.code==200){
                        var index = $scope.users.indexOf(user);
                        if(index!=-1){
                            $scope.users.splice(index, 1);
                        }
                    }
                });
        };
        $scope.updateRole = function(user){
            $http.get('/user/update/role?'+jQuery.param({id:user.id, role:user.role}))
                .success(function(data){
                    if(data.code==200){

                    }else{
                        if(user.role=='normal'){
                            user.role='leader';
                        }else{
                            user.role='normal';
                        }
                    }
                });
        };
    }])
    .controller('group', ['$scope', function($scope){
    }])
    .controller('groupReport', ['$scope', function($scope){
    }])
    .controller('groupInfo', ['$scope', '$http', '$modal',function($scope, $http, $modal){
        $http.get('/group/info')
            .success(function(_data){
                $scope.group = _data.group;
            });
        $scope.save = function(){
            $http.post('/group/info/update', $scope.group)
                .success(function(data){
                    if(data.code==200){
                        alert('保存成功');
                    }
                });
        };
        $scope.add = function(){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'add-member',
                controller: 'addMember'
            });
            modalInstance.result.then(function (selectedItem) {
                $http.get('/group/members/add?'+jQuery.param({groupId:$scope.group.id, userId:selectedItem.id}))
                    .success(function(data){
                        if(data.code==200){
                            $scope.group.members.push(selectedItem);
                        }
                    });
            }, function () {
                console.log('dismissed');
            });
        };
        $scope.delete = function(user){
            $http.get('/group/members/delete?'+jQuery.param({groupId:$scope.group.id, userId:user.id}))
                .success(function(data){
                    if(data.code==200){
                        var index = $scope.group.members.indexOf(user);
                        if(index!=-1){
                            $scope.group.members.splice(index, 1);
                        }
                    }
                });
        };
    }])
    .controller('addMember', ['$scope', '$modalInstance', '$http',function($scope, $modalInstance, $http){
        $scope.search = function(){
            $http.get('/user/search?name='+$scope.keyword)
                .success(function(data){
                    if(data.code==200){
                        $scope.users = data.users;
                    }
                });
        };
        $scope.ok = function(){
            if($scope.selected) $modalInstance.close($scope.selected);
            else $modalInstance.dismiss('cancel');
        };
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('addReport', ['$scope', '$modalInstance', 'report',function($scope, $modalInstance, report){
        $scope.report = report||{tasks:[]};
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
    .controller('TimeDropdown', function ($scope, $log) {
        var now = +new Date,
            day = 24*60*60*1000;
        $scope.items = [
            {text:'今天', time:now},
            {text:'昨天', time:(now-=day)},
            {text:'前天', time:(now-=day)},
            {text:'大前天', time:(now-=day)}
        ];
        $scope.selected = $scope.items[0];

        $scope.status = {
            isopen: false
        };

        $scope.select = function(item){
            $scope.selected = item;
        };
    })
    .controller('my', ['$scope', '$http', '$modal',function($scope, $http, $modal){
        $scope.reports = [];
        $http.get('/user/report/list')
            .success(function(data){
                if(data.code==200){
                    $scope.reports = data.reports;
                }
            });
        $scope.add = function(){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'add-report',
                controller: 'addReport',
                resolve:{
                    report:null
                }
            });
            modalInstance.result.then(function (report) {
                $http.post('/user/report/add', report)
                    .success(function(data){
                        if(data.code==200){
                            report.id = data.id;
                            $scope.reports.unshift(report);
                        }
                    });
            }, function () {
                console.log('dismissed');
            });
        };

        $scope.edit = function(report){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'add-report',
                controller: 'addReport',
                resolve:{
                    report:function(){
                        return JSON.parse(JSON.stringify(report));
                    }
                }
            });
            modalInstance.result.then(function (draftReport) {
                $http.post('/user/report/update', draftReport)
                    .success(function(data){
                        if(data.code==200){
                            angular.extend(report, draftReport);
                        }
                    });
            }, function () {
                console.log('dismissed');
            });
        };

        $scope.delete = function(index){
            $http.get('/user/report/delete?id='+$scope.reports[index].id)
                .success(function(data){
                    if(data.code==200){
                        $scope.reports.splice(index, 1);
                    }
                });
        };
    }])
    .filter('tasksToText', function(){
        return function(tasks){
            return tasks.map(function(task, index){
                return index+1+'.'+task.content+'('+task.time+'h)';
            }).join('\n');
        };
    })
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        $urlRouterProvider
            .otherwise('my');
        $stateProvider
            .state('account', {
                url:'/account',
                templateUrl:'accounts',
                controller:'accounts'
            })
            .state('my', {
                url:'/my',
                templateUrl:'my',
                controller:'my'
            })
            .state('group', {
                url:'/group',
                templateUrl:'group',
                controller:'group'
            })
            .state('group.report', {
                url:'/report',
                templateUrl:'group-report',
                controller:'groupReport'
            })
            .state('group.info', {
                url:'/info',
                templateUrl:'group-info',
                controller:'groupInfo'
            });
    }]);