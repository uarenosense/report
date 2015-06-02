angular.module('app', [])
    .controller('addReport', ['$scope', '$modalInstance', 'report',function($scope, $modalInstance, report){
        $scope.report = report||{tasks:[]};
        $scope.timeToggled = function(selected){
            $scope.report.time = selected.time;
        };
        $scope.add = function(){
            $scope.report.tasks.push({
                content:$scope.content,
                time:$scope.time
            });
            $scope.content = '';
            $scope.time = '';
        };
        $scope.delete = function(index){
            $scope.report.tasks.splice(index, 1);
        };
        $scope.ok = function(){
            if($scope.report.tasks.length) $modalInstance.close($scope.report);
            else $modalInstance.dismiss('cancel');
        };
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('TimeDropdown', function ($scope, $log) {
        var now = +new Date,
            day = 24*60*60*1000;
        $scope.items = [
            {text:'今天', time:now},
            {text:'昨天', time:(now-=day)},
            {text:'前天', time:(now-=day)},
            {text:'大前天', time:(now-=day)}
        ];
        $scope.selected = $scope.items[0];

        $scope.status = {
            isopen: false
        };

        $scope.select = function(item){
            $scope.selected = item;
        };
    })
    .controller('my', ['$scope', '$http', '$modal',function($scope, $http, $modal){
        $scope.reports = [];
        $http.get('/user/report/list')
            .success(function(data){
                if(data.code==200){
                    $scope.reports = data.reports;
                }
            });
        $scope.add = function(){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'add-report',
                controller: 'addReport',
                resolve:{
                    report:null
                }
            });
            modalInstance.result.then(function (report) {
                $http.post('/user/report/add', report)
                    .success(function(data){
                        if(data.code==200){
                            report.id = data.id;
                            $scope.reports.unshift(report);
                        }
                    });
            }, function () {
                console.log('dismissed');
            });
        };

        $scope.edit = function(report){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'add-report',
                controller: 'addReport',
                resolve:{
                    report:function(){
                        return JSON.parse(JSON.stringify(report));
                    }
                }
            });
            modalInstance.result.then(function (draftReport) {
                $http.post('/user/report/update', draftReport)
                    .success(function(data){
                        if(data.code==200){
                            angular.extend(report, draftReport);
                        }
                    });
            }, function () {
                console.log('dismissed');
            });
        };

        $scope.delete = function(index){
            $http.get('/user/report/delete?id='+$scope.reports[index].id)
                .success(function(data){
                    if(data.code==200){
                        $scope.reports.splice(index, 1);
                    }
                });
        };
    }]);