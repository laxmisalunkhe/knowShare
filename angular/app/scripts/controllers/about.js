'use strict';

/**
 * @ngdoc function
 * @name knowShareApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the knowShareApp
 */
angular.module('knowShareApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
