angular.module('login', ['ngRoute'])
    .controller('tab', ['$scope', '$location',function($scope, $location){
        $scope.tabClass = function(tab){
            return tab==$location.path()?'active':'';
        };
    }])
    .controller('login', ['$scope', '$http', function($scope, $http){
        var _loginData = {},
            _registerData = {};
        $scope.tab='login';
        $scope.data = _loginData;
        $scope.changeTab = function(tab){
            $scope.tab = tab;
            $scope.data = tab=='login'?_loginData:_registerData;
        };
        $scope.submit = function(){
            $scope.form.$setDirty();
            if($scope.form.$invalid) return;
            if($scope.tab=='login'){
                $http.post('/user/login', $scope.data)
                    .success(function(result){
                        if(result.code==200){
                            location.href = '/static/index.html';
                        }else{
                            alert(result.message||'登录失败');
                        }
                    });
            }else{
                $http.post('/user/register', $scope.data)
                    .success(function(result){
                        if(result.code==200){
                            location.href = '/static/index.html';
                        }else{
                            alert(result.message||'注册失败失败');
                        }
                    });
            }

        }
    }])
    .controller('register', ['$scope', '$http', function($scope, $http){
        $scope.submit = function(){
            if($scope.form.$invalid) return;
            if($scope.tab=='login'){
                $http.post('/user/login', $scope.data)
                    .success(function(result){
                        if(result.code==200){
                            location.href = '/static/index.html';
                        }else{
                            alert(result.message||'登录失败');
                        }
                    });
            }else{
                $http.post('/user/register', $scope.data)
                    .success(function(result){
                        if(result.code==200){
                            location.href = '/static/index.html';
                        }else{
                            alert(result.message||'注册失败失败');
                        }
                    });
            }

        }
    }])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/login', {templateUrl:'login', controller:'login'})
            .when('/register', {templateUrl:'register', controller:'register'})
            .otherwise({redirectTo: '/login'});
    }]);