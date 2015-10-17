'use strict';

/**
 * @ngdoc function
 * @name knowShareApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the knowShareApp
 */
angular.module('knowShareApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
