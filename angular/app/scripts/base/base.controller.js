/* global gobiggiApp */
'use strict';
knowShareApp.controller('BaseController', ['$scope', 'ROUTES', '$rootScope', '$window', '$modal', 'UserModel', '$location', 'AuthModel', '$q', '$state', '$templateRequest', '$sce',
    function($scope, ROUTES, $rootScope, $window, $modal, UserModel, $location, AuthModel, $q, $state, $templateRequest, $sce) {
        $rootScope.alert = {};
        $scope.baseScope = {};
        var $modalInstance;
        /*$scope.alertMessage = {
            type: '',
            title: '',
            content: ''
        };*/
        $scope.alertMessage = {
          "type": "info",
          "title": "Success!",
          "content": "alert directive is working pretty well with 3 sec timeout"
        };

        $scope.logout = function() {
            AuthModel.logout().success( function() {
                console.log('successfully logout');
                $rootScope.userInstance = {};
            }).error( function() {
                console.log('Unable to logout');
            })
        }

        $scope.baseScope.alerts = [];
        $scope.addAlert = function(alert) {
            $scope.baseScope.alerts.push(alert);
        }

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
            } else if (toState.name === 'viewOnly') {
                $rootScope.tabName = toParams.tabName;
            } else if (!$rootScope.isLoggedIn) {
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
    }
]);