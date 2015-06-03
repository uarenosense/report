angular.module('app.controllers', [])
    .controller('tab', ['$scope', '$location',function($scope, $location){
        $scope.isActive = function(tab){
            return new RegExp(tab).test($location.path());
        };
    }]);