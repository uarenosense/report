ListBoxController.$inject = ['$scope'];
function ListBoxController($scope){

    this.setTotal = function(total){
        $scope.total = parseInt(total)||0;
    };

    this.setPage = function(page){
        $scope.page = parseInt(page)||0;
    };

    this.setLimit = function(limit){
        $scope.limit = parseInt(limit)||10;
    };

    this.setState = function(state){
        if(state=='loading'){
            $scope.stateTip = '<div class="loading"><i></i>加载中...</div>';
        }else if(state=='empty'){
            $scope.stateTip = '<div class="list-empty">暂无数据</div>';
        }else if(state=='error'){
            $scope.stateTip = '<div class="list-error">加载失败</div>';
        }else{
            $scope.stateTip = null;
        }
    };
};
angular.module('app.directives.list.box', ['templates.common', 'ui.bootstrap', 'ngSanitize'])
    .directive('listBox', ['$parse', function($parse){
        return {
            restrict:'E',
            controller:ListBoxController,
            transclude:true,
            templateUrl:'directives/list.box.tpl.html',
            link:function(scope, element, attrs, ctrl){
                var alias = attrs.name,
                    limit = attrs.limit,
                    getter = $parse(attrs.onPageChange),
                    onPageChange = getter(scope);
                if(alias){
                    scope[alias] = ctrl;
                }
                ctrl.setLimit(limit);
                ctrl.setPage(1);
                ctrl.setTotal(0);
                if(onPageChange){
                    scope.pageChanged = function(){
                        onPageChange({
                            page:scope.page||0,
                            offset:(scope.page-1)*scope.limit,
                            limit:scope.limit
                        });
                    };
                    scope.pageChanged();
                }else{
                    scope.noPage = true;
                }
            }

        }
    }]);