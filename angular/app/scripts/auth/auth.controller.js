/* global gobiggiApp */
'use strict';
knowShareApp.controller('AuthController', ['$scope', 'ROUTES', '$rootScope', '$window', '$modal', 
        'UserModel', 'AuthModel', '$q', '$state', '$templateRequest', '$sce', 
    function($scope, ROUTES, $rootScope, $window, $modal, UserModel, AuthModel, $q, 
        $state, $templateRequest, $sce) {

    $rootScope.alert = {};
    $scope.baseScope = {};
    var $modalInstance;

    $scope.openModal = function(size, siteMode, relativeTemplateUrl) {
        $modalInstance = $modal.open({
            animation: true,
            templateUrl: ROUTES.RESOURCES + relativeTemplateUrl,
            scope: $scope,
            size: size,
            resolve: {
                publishData: function() {
                    return $scope.modalData;
                }
            }
        });
        $modalInstance.result.then(function(selectedItem) {
            // Add code after successful modal closing execution
        });
    };

    $scope.ok = function() {
        $modalInstance.close($scope.modalData);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'customState') {
            $rootScope.ctrl = toParams.ctrl;
            $rootScope.action = toParams.action;
        }
        if (toState.name === 'viewOnly') {
            $rootScope.tabName = toParams.tabName;
        }
        // Checking is user loggedIn or not
        if (!$rootScope.isLoggedIn) {
            $rootScope.isLoggedIn = auth();
        }
    });

    var userDetailsPromise;
    function getUserDetails() {
        return $q(function(resolve, reject) {
            UserModel.load().success(function(resp) {
                $rootScope.userInstance = resp;
                resolve(initialiseUser(resp));
            }).error(function(error) {
                reject(error);
                console.error('Unable to fetch current loggedIn user details.');
            });
        });
    }

    function auth() {
        var isLoggedIn = false;
        AuthModel.isLoggedIn().success(function(resp) {
            isLoggedIn = true;
            $rootScope.chkUser = 'show';
            userDetailsPromise = getUserDetails();
        }).error(function(error) {
            isLoggedIn = false;
            $rootScope.chkUser = 'hide';
            $state.go("home");
        });
        return isLoggedIn;
    }

    function initialiseUser(userResponse) {
        if (userResponse === undefined) {
            console.error('User response not found to initialize user instance.');
            return;
        }
        var customName = 'Unknown';
        var userEmail = userResponse.email;
        if (userEmail) {
            customName = userEmail.substring(0, userEmail.lastIndexOf('@'));
        }
        if (!userResponse.name) {
            $rootScope.userInstance.name = customName;
        }
        if (!userResponse.profileImageUrl) {
            var defaultAvatarUrl = ROUTES.RESOURCES + 'images/generic-photo.jpg';
            $rootScope.userInstance.profileImageUrl = defaultAvatarUrl;
        }
        $scope.$broadcast('userLoad', {});
    }

    $scope.$on('userLoad', function (event, args) {
        UserModel.getNotificationList().success( function(notificationList) {
            if (!notificationList || notificationList === undefined) {
                console.log('Unable to found websites for current user.');
                return;
            }
            $rootScope.userInstance.notifications = notificationList;
        }).error( function(error) {
            console.error(error, 'Unable to fetch websites of current user.');
        });
    });
}]);