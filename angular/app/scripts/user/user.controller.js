/* global gobiggiApp */
'use strict';
knowShareApp.controller('UserController', ['$scope', 'ROUTES', '$rootScope', 'UserModel', '$q', '$state', 
    function($scope, ROUTES, $rootScope, UserModel, $q, $state) {
        $rootScope.alert = {};
        $scope.baseScope = {};
        var $modalInstance;

        // ID: 1 Knowledge Seeker
        // ID: 2 Trainer

        $scope.updateSeeker = function() {
            var categoryTags = [];
            angular.forEach($scope.seekerData.categoryTags, function(tag) {
                categoryTags.push(tag);
            });
            $scope.seekerData.categoryTags = categoryTags;
            UserModel.updateSeeker($scope.seekerData).success( function() {
                $scope.success = true;
                console.log("Knowledge Seeker Data Saved successfully");
                $state.go("viewOnly", {tabName: "dashboard"});
            }).error( function() {
                $scope.success = false;
                console.log("Unable to save Knowledge Seeker Data.");
            });
        }

        $scope.updateTrainer = function() {
            UserModel.updateTrainer($scope.trainerData).success( function() {
                $scope.success = true;
                console.log("Trainer Data Saved successfully");
                $state.go("viewOnly", {tabName: "dashboard"});
            }).error( function() {
                $scope.success = false;
                console.log("Unable to save Trainer Data.");
            });
        }
    }
]);