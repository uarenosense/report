angular.module('app.account', ['app.directives.list.box'])
    .controller('Account', ['$scope', '$http', function($scope, $http){
        $scope.pageChange = function(data){
            $scope.listBox.setState('loading');
            $http.get('/user/list?'+jQuery.param(data))
                .success(function(data){
                    if(data.code==200){
                        if(data.users&&data.users.length){
                            $scope.listBox.setState('success');
                            $scope.users = data.users;
                            $scope.listBox.setTotal(data.count);
                        }else{
                            $scope.listBox.setState('empty');
                        }
                    }else{
                        $scope.listBox.setState('error');
                    }
                })
                .error(function(){
                    $scope.listBox.setState('error');
                });
        };

        $scope.delete = function(user){
            if(!window.confirm('确定删除用户？')) return;
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