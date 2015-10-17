/* global knowShareApp */
'use strict';

knowShareApp.config(function($locationProvider, $stateProvider, $urlRouterProvider, ROUTES) {

    $urlRouterProvider.otherwise('/');
    $stateProvider.state('home', {
        url: "/",
        templateUrl: ROUTES.RESOURCES + "views/home.html",
    })
    .state('viewOnly', {
        url: "/:tabName",
        templateUrl: function($stateParams) {
            return ROUTES.RESOURCES + "views/" + $stateParams.tabName + ".html";
        }
    })
    .state('customState', {
        url: '/:ctrl/:action',
        templateUrl: function ($stateParams) {
            return ROUTES.RESOURCES + 'views/' + $stateParams.ctrl + '/' + $stateParams.action + '.html';
        },
        onEnter: function($state, $stateParams, $http) {
            if ($stateParams.ctrl === 'auth' && $stateParams.action === 'login') {
                $http.get('checkAuthentication').success(function(data) {
                    if (data.status === true) {
                        $state.go("home")
                    }
                });
            }
        }
    });
});