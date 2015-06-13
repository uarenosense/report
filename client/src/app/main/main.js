angular.module('app.main', [])
    .controller('Main', ['$scope', '$http', function($scope, $http){
        $scope.user = window.USER;
        $scope.logout = function(){
            $http.get('/report/api/user/logout')
                .success(function(result){
                    if(result.code==200){
                        location.hash = '/login/login';
                        delete window.USER;
                    }
                });
        }
    }]);