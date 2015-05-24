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
    .controller('my', ['$scope', function($scope){
    }])
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