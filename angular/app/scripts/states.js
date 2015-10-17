/* global knowShareApp */
'use strict';

knowShareApp.config(function($locationProvider, $stateProvider, $urlRouterProvider, 
        $ocLazyLoadProvider, ROUTES) {
    
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });
    
    $urlRouterProvider.otherwise('/editor/home');
    $stateProvider.state('base', {
            abstract: true,
            url: "/editor",
            templateUrl: ROUTES.RESOURCES + "views/layouts/content.html",
        })
    .state('base.home', {
        title: 'Home',
        url: '/home',
        templateUrl: ROUTES.RESOURCES + 'views/dashboard.html'
    }).state('base.view', {
        url: '/:ctrl/:action',
        templateUrl: function ($stateParams) {
            return ROUTES.RESOURCES + 'views/' + $stateParams.ctrl + '/' + $stateParams.action + '.html';
        },
        onEnter: function($state, $stateParams, $http) {
            if ($stateParams.ctrl === 'auth' && $stateParams.action === 'login') {
                $http.get('checkAuthentication').success(function(data) {
                    if (data.status === true) {
                        window.location.href = ROUTES.ROOT + 'dashboard';
                    }
                });
            }
        }
    });
});