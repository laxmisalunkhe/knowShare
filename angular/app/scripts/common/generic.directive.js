knowShareApp.directive('notification', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            ngModel: '='
        },
        template: '<div class="alert fade" bs-alert="ngModel"></div>',
        link: function(scope, element, attrs) {
            $timeout(function() {
                element.hide();
            }, 3000);
        }
    }
}]);