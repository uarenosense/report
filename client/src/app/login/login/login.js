angular.module('app.login', [])
    .controller('Login', ['$scope', '$http', function($scope, $http){
        $scope.submit = function(){
            $scope.form.$setDirty();
            if($scope.form.$invalid) return;
            var data = angular.extend({}, $scope.data);
            data.password = md5(data.password);
            $scope.loading = true;
            $scope.errorMessage = '';
            $http.post('/user/login', data)
                .success(function(result){
                    $scope.loading = false;
                    if(result.code==200){
                        location.hash = '/my';
                    }else{
                        $scope.errorMessage = result.message||'登录失败';
                    }
                })
                .error(function(){
                    $scope.loading = false;
                    $scope.errorMessage = '登录失败';
                });
        }
    }]);