angular.module('app', ['ui.router'])
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
    .controller('groupInfo', ['$scope', function($scope){
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