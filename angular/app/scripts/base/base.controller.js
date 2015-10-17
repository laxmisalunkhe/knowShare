/* global gobiggiApp */
'use strict';
knowShareApp.controller('BaseController', ['$scope', 'ROUTES', '$rootScope', '$window', '$modal', 'UserModel', '$location', 'TemplateModel', '$q', '$state', '$templateRequest', '$sce', function($scope, ROUTES, $rootScope, $window, $modal, UserModel, $location, TemplateModel, $q, $state, $templateRequest, $sce) {
    $rootScope.alert = {};
    $scope.baseScope = {};
    $scope.baseScope.userSites = [];
    $scope.templateData = {};
    $scope.publishData = {};
    $scope.templateList = [];
    $rootScope.userSites = [];
    var $modalInstance;

    var fetchTemplateListPromise = fetchTemplateList();

    function fetchTemplateList() {
        return $q(function(resolve, reject) {
            var category;
            UserModel.getBusinessCategory().success( function(businessCategory) {
                if (!businessCategory || businessCategory === undefined) {
                    console.log('Unable to fetch business category selected by user.');
                    return;
                }
                category = businessCategory;
                localStorage.setItem('businessCategory', businessCategory.trim());
                TemplateModel.getTemplateList(category.trim()).success(function(resp) {
                        resolve(processTemplateList(resp));
                }).error(function(error) {
                    reject(error, 'Unable to fetch template list.');
                });
            }).error( function(error) {
                console.error(error, 'Unable to fetch business category selected by user.');
            });
            console.log('categaory----->', category);
        });
    }

    $q.all([fetchTemplateListPromise, userDetailsPromise]).then(function() {
        if ($scope.templateList[0]) {
            $rootScope.category = $scope.templateList[0].category;
            $rootScope.subCategory = $scope.templateList[0].subCategory;
            $rootScope.templateId = $scope.templateList[0].templateId;
            $rootScope.templateThumbnail = $scope.templateList[0].templateThumbnail;
            $rootScope.templateCreateMode = true;
            $state.go("base.templatePreview", {
                type: $rootScope.category,
                subType: $rootScope.subCategory,
                templateId: $rootScope.templateId
            });
        }
    });

    $scope.getTemplates = function(category) {
        TemplateModel.getTemplateList(category).success(function(resp) {
            return processTemplateList(resp);
        }).error(function(error) {
            console.error(error, 'Unable to fetch template list.');
        });
    }

    function processTemplateList(templateListResponse) {
        if (!templateListResponse && templateListResponse === undefined) {
            console.log('Website data not found for current user.');
            return;
        }
        angular.forEach(templateListResponse, function(templateData) {
            var template = $scope.processTemplateResponse(templateData);
            if (template) {
                $scope.templateList.push(template);
            }
        });
    }
    $scope.processTemplateResponse = function(response) {
        var template = {
            templateId: response.template_id,
            category: response.template_category,
            subCategory: response.template_subcategory,
            templateThumbnail: response.template_thumbnail
        };
        if (response.template_data) {
            $scope.response = angular.fromJson(response.template_data);
            template.templateData = $scope.response;
        }
        return template;
    }
    $scope.publishTemplate = function() {
        if ($scope.publishData.businessName) {
            $scope.publishSite($scope.publishData.businessName);
        } else {
            console.error('Unable to publish site. Site URL not found.')
        }
    }
    $scope.saveTemplate = function() {
        $scope.openModal('modal-sm', 'saveMode', 'views/publish/save.html');
    }
    $scope.openModal = function(size, siteMode, relativeTemplateUrl) {
        $modalInstance = $modal.open({
            animation: true,
            templateUrl: ROUTES.RESOURCES + relativeTemplateUrl,
            scope: $scope,
            size: size,
            resolve: {
                publishData: function() {
                    return $scope.publishData;
                }
            }
        });
        $modalInstance.result.then(function(selectedItem) {
            if (siteMode === 'saveMode') {
                $scope.publishData.businessName = selectedItem.businessName;
                $scope.openSite($scope.publishData.businessName, false);
            } else if (siteMode === 'publishMode') {
                //TODO: Add Code to update domain on user requirement.
                $scope.publishData.publishURL = selectedItem.publishURL;
                $scope.openPublishedSite($scope.publishData.publishURL);
            }
        });
    };
    $scope.openSite = function(siteName, viewOnly) {
        var response = '';
        if (!siteName) {
            console.error("Unable to show site. Please provide site name.");
            return;
        }
        if (!viewOnly) {
            // Code to save website on server and then view to user
            response = $scope.saveSite(siteName);
        } else {
            var templatePath = ROUTES.RESOURCES + '../sites/' + siteName + '/index.html';
            $window.open(templatePath, '_blank');
        }
    }
    $scope.openPublishedSite = function(publishURL) {
        if (!publishURL) {
            console.error("Unable to show published site.");
            return;
        }
        var siteURL = 'http://' + publishURL;
        $window.open(siteURL, '_blank');
    }

    function getTemplateHTML() {
        return $q(function(resolve, reject) {
            var templateSourcePath = $scope.ROUTES.TEMPLATE_RESOURCES + 'index.html';
            var templateUrl = $sce.getTrustedResourceUrl(templateSourcePath);
            var sourceHTML;
            $templateRequest(templateUrl).then(function(template) {
                var removableString = '<span class="default-css-files dev-css-file" ng-if="templatePreview !== false" >' + '<link rel="stylesheet/less" type="text/css" ng-href="{{ ROUTES.TEMPLATE_RESOURCES + \'css/001.less\'}}" ' + '/></span>';
                var lessFileIndex = template.indexOf(removableString);
                sourceHTML = template;
                if (lessFileIndex !== -1) {
                    sourceHTML = template.replace(removableString, '');
                }
                resolve(sourceHTML);
            }, function(error) {
                reject(error, 'Unable to fetch template index file.');
            });
        });
    }
    /*
     * Code to save website on server and then view to user
     */
    $scope.saveSite = function(siteName) {
        var fetchTemplateIndexFilePromise = getTemplateHTML();
        return fetchTemplateIndexFilePromise.then(function(sourceHTML) {
            var params = {
                templateData: JSON.stringify($rootScope.currentProccessedTemplate.templateData),
                masterData: JSON.stringify($rootScope.userSites[0].userData),
                sourceHTML: sourceHTML,
                siteName: siteName,
                templateCategory: $rootScope.category,
                templateSubcategory: $rootScope.subCategory,
                templateId: $rootScope.templateId
            };
            return UserModel.saveTemplate(params).success(function(resp) {
                $rootScope.savedWebsite = true;
                var templatePath = ROUTES.RESOURCES + '../sites/' + siteName + '/index.html';
                $window.open(templatePath, '_blank');
            }).error(function(error) {
                console.log(error, 'error on save site');
            });
        })
    }
    $scope.publishSite = function(siteName) {
        return UserModel.publishSite({
            siteName: siteName
        }).success(function(publishURL) {
            $scope.publishData.publishURL = publishURL.trim();
            $scope.openModal('modal-sm', 'publishMode', 'views/publish/business.html');
        }).error(function(error) {
            console.log(error, 'error on publish site');
        });
    }
    $scope.ok = function() {
        $modalInstance.close($scope.publishData);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'base.templatePreview') {
            // Provision to differentiate saved websites and templates
            $rootScope.siteId = undefined;
            $rootScope.category = toParams.type;
            $rootScope.subCategory = toParams.subType;
            $rootScope.templateId = toParams.templateId;
            $rootScope.templatePreview = true;
            $scope.ROUTES.TEMPLATE_RESOURCES = $scope.ROUTES.TEMPLATE + toParams.type + '/' + toParams.subType + '/' + toParams.templateId + '/';
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
        UserModel.isLoggedIn().success(function(resp) {
            isLoggedIn = true;
            $rootScope.chkUser = 'show';
            userDetailsPromise = getUserDetails();
            //getUserDetails();
        }).error(function(error) {
            isLoggedIn = false;
            $rootScope.chkUser = 'hide';
            window.location.href = ROUTES.ROOT;
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
        UserModel.getWebsiteList().success( function(sitesList) {
            if (!sitesList || sitesList === undefined) {
                console.log('Unable to found websites for current user.');
                return;
            }
            $rootScope.userInstance.sites = sitesList;
        }).error( function(error) {
            console.error(error, 'Unable to fetch websites of current user.');
        });
    });

    $scope.createNewSite = function() {
        $rootScope.siteId = undefined;
    }
    $scope.showAlert = function() {
        $scope.alert = {
            msg: 'Another alert!'
        };
    };
    $scope.hideAlert = function(index) {
        $scope.alert = undefined;
    };
    $scope.redirectToFormEditor = function() {
        window.location.href = ROUTES.ROOT + '#/formEditor/create';
    }

    $scope.$on('$routeChangeStart', function() {
        $scope.isViewLoading = true;
    });
    $scope.$on('$routeChangeSuccess', function() {
        $scope.isViewLoading = false;
    });
    $scope.$on('$routeChangeError', function() {
        $scope.isViewLoading = false;
    });

    // Fix to set top position of left sidebar
    setTimeout(function() {
        var parentNavbarHeight = $('.site-editor-navbar').height();
        $('.site-editor-sidebar').css('top', parentNavbarHeight + 'px');
    }, 1000);
}]);