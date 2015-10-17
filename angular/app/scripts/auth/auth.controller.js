/* global gobiggiApp */
'use strict';
knowShareApp.controller('AuthController', ['$scope', '$rootScope', '$window', '$modal', 
        'UserModel', 'AuthModel', '$state', '$http',
    function($scope, $rootScope, $window, $modal, UserModel, AuthModel, $state, $http) {

    $scope.login = function() {
        AuthModel.login($scope.loginData).success(function(resp) {
            $rootScope.errorMessage = '';
            $rootScope.userInstance = resp;
            $scope.updateProfile();
        }).error(function(error) {
            $rootScope.errorMessage = "Invalid Credentials."
            console.error('Unable to login user.');
        });
    }

    $scope.register = function() {
        AuthModel.register($scope.registrationData).success(function(resp) {
            $rootScope.errorMessage = '';
            $rootScope.userInstance = resp;
            $scope.updateProfile();
        }).error(function(error) {
            $rootScope.errorMessage = "Unable to register. Please try again."
            console.error('Unable to register user.');
        });
    }

    // Role ID: 2 Knowledge Seeker
    // Role ID: 3 Trainer
    $scope.updateProfile = function() {
        if (!$rootScope.userInstance) {
            console.log('User not logged in');
            $state.go("customState", {ctrl: "auth", action: "login"});
        }
        if ($rootScope.userInstance.roleId === 2) { 
            $state.go("customState", {ctrl: "profile", action: "knowledgeGainer"});
        } else if ($rootScope.userInstance.roleId === 3) { 
            $state.go("customState", {ctrl: "profile", action: "trainer"});
        }
    }
}]);