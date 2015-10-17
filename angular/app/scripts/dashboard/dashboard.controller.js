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

    $scope.viewSite = function(siteName, viewOnly) {
        $scope.openSite(siteName, viewOnly);
    }

    $scope.editSite = function(siteId, templateId, category, subCategory) {
        $rootScope.siteId = siteId;
        $rootScope.category = category;
        $rootScope.subCategory = subCategory;
        $rootScope.templateId = templateId;
        $rootScope.templatePreview = true;
        $rootScope.siteEditMode = true;
        $state.go("base.templatePreview", {type: category, subType: subCategory, 
            templateId: templateId});
    }
}]);

