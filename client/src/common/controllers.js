angular.module('app.controllers', [])
    .controller('tab', ['$scope', '$location',function($scope, $location){
        $scope.tabClass = function(tab){
            return tab==$location.path()?'active':'';
        };
    }]);