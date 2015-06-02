angular.module('app', [])
    .controller('Register', ['$scope', '$http', function($scope, $http){
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
    }]);