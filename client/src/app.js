angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'app.controllers',
    'templates.app',
    'templates.common',
    'app.login',
    'app.register',
    'app.account',
    'app.group.info',
    'app.group.report',
    'app.my'
])
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/m/my");
        $stateProvider
            .state('login', {
                url:'/login',
                templateUrl:'login/login.tpl.html'
            })
            .state('login.login', {
                url:'/login',
                templateUrl:'login/login/login.tpl.html',
                controller:'Login'
            })
            .state('login.register', {
                url:'/register',
                templateUrl:'login/register/register.tpl.html',
                controller:'Register'
            })
            .state('main', {
                url:'/m',
                templateUrl:'main/main.tpl.html'
            })
            .state('main.account', {
                url:'/account',
                templateUrl:'main/account/account.tpl.html',
                controller:'Account'
            })
            .state('main.group', {
                url:'/group',
                templateUrl:'main/group/group.tpl.html'
            })
            .state('main.group.report', {
                url:'/report',
                templateUrl:'main/group/report/report.tpl.html'
            })
            .state('main.group.info', {
                url:'/info',
                templateUrl:'main/group/info/info.tpl.html',
                controller:'GroupInfo'
            })
            .state('main.my', {
                url:'/my',
                templateUrl:'main/my/my.tpl.html',
                controller:'My'
            });

    }]);
jQuery.get('/user/login/get')
    .success(function(data){
        if(data.code!=200) location.hash = '/login/login';
        angular.bootstrap(document.body, ['app']);
    })
    .error(function(){
        location.hash = '/login/login';
        angular.bootstrap(document.body, ['app']);
    });