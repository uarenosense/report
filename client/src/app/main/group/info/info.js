angular.module('app.group.info', ['app.directives.list.box'])
    .controller('AddMember', ['$scope', '$modalInstance', '$http',function($scope, $modalInstance, $http){
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

        $scope.$watchCollection('group.members', function(members){
            if($scope.listBox){
                if(!(members&&members.length)){
                    $scope.listBox.setState('empty');
                }else{
                    $scope.listBox.setState();
                }
            }

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
                templateUrl: 'main/group/info/add.member.tpl.html',
                controller: 'AddMember'
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
            if(!window.confirm('确定删除组员？')) return;
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