'use strict';

/**
 * @ngdoc function
 * @name ngApp.factory:UserModel
 * @description
 * # UserModel
 * Factory of the ngApp
 */
knowShareApp.factory('UserModel', ['$http', 'ROUTES', function($http, ROUTES) {  
    function UserModel(userData) {
        if (userData) {
            this.setData(userData);
        }
        // Some other initializations related to UserModel
    };
    UserModel.prototype = {
        setData: function(userData) {
            angular.extend(this, userData);
        },
        load: function() {
            var scope = this;
            return $http.get(ROUTES.ROOT + 'user/Profile').success(function(userData) {
                scope.setData(userData);
            });
        },
        getNotificationData: function(notificationId) {
            return $http.get(ROUTES.ROOT + 'notification/' + notificationId);
        },
        getNotificationList: function() {
            return $http.get(ROUTES.ROOT + 'notificationList');
        },
        saveData: function(data) {
            return $http.post(ROUTES.ROOT + 'saveData', data)
        },
        updateTrainer: function(data) {
            return $http.post(ROUTES.ROOT + 'updateTrainer', data)
        },
        updateSeeker: function(data) {
            return $http.post(ROUTES.ROOT + 'updateSeeker', data)
        }
    };
    return new UserModel();
}]);