angular.module('app', ['ui.router', 'ui.bootstrap', 'app.controllers', 'templates.app', 'templates.common'])
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('login', {
                url:'/login',
                templateUrl:'login/login.tpl.html'
            })
            .state('login.login', {
                url:'/login/login',
                templateUrl:'login/login/login.tpl.html',
                controller:'Login'
            })
            .state('login.register', {
                url:'/login/register',
                templateUrl:'login/register/register.tpl.html',
                controller:'Register'
            });

    }]);