/* global gobiggiApp */
'use strict';
knowShareApp.controller('UserController', ['$scope', 'ROUTES', '$rootScope', 'UserModel', '$q', '$state', 
    function($scope, ROUTES, $rootScope, $window, $modal, UserModel, $location, AuthModel, $q, $state) {
        $rootScope.alert = {};
        $scope.baseScope = {};
        var $modalInstance;

        // ID: 1 Knowledge Seeker
        // ID: 2 Trainer

        $scope.updateSeeker = function() {
            UserModel.updateSeeker($scope.userData).success( function() {
                $scope.success = true;
                console.log("Knowledge Seeker Data Saved successfully")
            }).error( function() {
                $scope.success = false;
                console.log("Unable to save Knowledge Seeker Data.")
            });
        }

        $scope.updateTrainer = function() {
            UserModel.updateTrainer($scope.userData).success( function() {
                $scope.success = true;
                console.log("Trainer Data Saved successfully")
            }).error( function() {
                $scope.success = false;
                console.log("Unable to save Trainer Data.")
            });
        }
    }
]);