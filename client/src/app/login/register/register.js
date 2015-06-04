angular.module('app.register', [])
    .controller('Register', ['$scope', '$http', function($scope, $http){
        $scope.submit = function(ev){
            ev.preventDefault();
            if($scope.form.$invalid) return;
            var data = angular.extend({}, $scope.data);
            data.password = md5(data.password);
            $scope.loading = true;
            $scope.errorMessage = '';
            $http.post('/user/register', data)
                .success(function(result){
                    $scope.loading = false;
                    if(result.code==200){
                        location.hash = '/my';
                        window.USER = result.user;
                    }else{
                        $scope.errorMessage = result.message||'注册失败';
                    }
                })
                .error(function(){
                    $scope.errorMessage = '注册失败';
                });

        }
    }]);