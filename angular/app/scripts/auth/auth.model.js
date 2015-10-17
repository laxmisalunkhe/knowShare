'use strict';

/**
 * @ngdoc function
 * @name ngApp.factory:AuthModel
 * @description
 * # AuthModel
 * Factory of the ngApp
 */
knowShareApp.factory('AuthModel', ['$http', 'ROUTES', function($http, ROUTES) {  
    function AuthModel(authData) {
        if (authData) {
            this.setData(authData);
        }
        // Some other initializations related to AuthModel
    };
    AuthModel.prototype = {
        isLoggedIn: function() {
            return $http.get(ROUTES.ROOT + 'user/check');
        },
        login: function(data) {
            return $http.post(ROUTES.ROOT + 'login', data)
        },
        register: function(data) {
            return $http.post(ROUTES.ROOT + 'register', data)
        }
    };
    return new AuthModel();
}]);