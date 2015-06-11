angular.module('app.group.report', ['app.directives.list.box'])
    .controller('GroupReport', ['$scope', '$http',function($scope, $http){
        $scope.pageChange = function(data){
            $scope.listBox.setState('loading');
            $http.get('/group/report/list?id='+jQuery.param(data))
                .success(function(data){
                    if(data.code==200){
                        if(data.reports&&data.reports.length){
                            $scope.reports = data.reports;
                            $scope.listBox.setTotal(data.count);
                            $scope.listBox.setState('success');
                        }else{
                            $scope.listBox.setState('empty');
                        }

                    }else{
                        $scope.listBox.setState('error');
                    }
                })
                .error();
        };
    }]);