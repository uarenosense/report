angular.module('app.login', [])
    .controller('Login', ['$scope', '$http', function($scope, $http){
        $scope.data = {remember:true};
        $scope.submit = function(ev){
            ev.preventDefault();
            $scope.form.$setDirty();
            if($scope.form.$invalid) return;
            var data = angular.extend({}, $scope.data);
            data.password = md5(data.password);
            $scope.loading = true;
            $scope.errorMessage = '';
            $http.post('/report/api/user/login', data)
                .success(function(result){
                    $scope.loading = false;
                    if(result.code==200){
                        location.hash = '/my';
                        window.USER = result.user;
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