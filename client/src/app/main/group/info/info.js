angular.module('app', [])
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
    .controller('GroupInfo', ['$scope', '$http', '$modal',function($scope, $http, $modal){
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
        $scope.delete = function(user){
            $http.get('/group/members/delete?'+jQuery.param({groupId:$scope.group.id, userId:user.id}))
                .success(function(data){
                    if(data.code==200){
                        var index = $scope.group.members.indexOf(user);
                        if(index!=-1){
                            $scope.group.members.splice(index, 1);
                        }
                    }
                });
        };
    }]);