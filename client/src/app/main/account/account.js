angular.module('app.account', [])
    .controller('Account', ['$scope', '$http', function($scope, $http){
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
    }]);