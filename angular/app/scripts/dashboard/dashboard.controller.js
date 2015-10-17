'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:DashboardController
 * @description
 * # DashboardController
 * Controller of the ngApp
 */
knowShareApp.controller('DashboardController', ['$scope', '$rootScope', 
    '$state', function ($scope, $rootScope, $state) {

    $scope.$on('userLoad', function (event, args) {
        UserModel.getNotificationList().success( function(notificationList) {
            if (!notificationList || notificationList === undefined) {
                console.log('Unable to found notifications for current user.');
                return;
            }
            $rootScope.userInstance.notifications = notificationList;
        }).error( function(error) {
            console.error(error, 'Unable to fetch websites of current user.');
        });
    });

}]);

