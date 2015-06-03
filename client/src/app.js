angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'app.controllers',
    'templates.app',
    'templates.common',
    'app.login',
    'app.register'])
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
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
                templateUrl:''
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