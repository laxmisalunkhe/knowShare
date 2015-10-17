'use strict';
/**
 * @ngdoc overview
 * @name knowShareApp
 * @description
 * # knowShareApp
 *
 * Main module of the application.
 */

var hostname = window.location.hostname;
var serverPath = 'http://localhost/';
var subDirPath = 'knowShare/';
if (hostname === 'staging.gobiggi.com') {
    serverPath = 'http://staging.gobiggi.com/';
    subDirPath = '';
}
var knowShareApp = angular.module('knowShareApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 
    'ngSanitize', 'ngTouch', 'ui.router', 'ui.bootstrap']);

knowShareApp.constant('ROUTES', (function() {
    // Temporary Added static root directory
    var root = serverPath + subDirPath;
    return {
        ROOT: root + 'public/',
        APP: root + 'angular/app/',
        BOWER: root + 'bower_components/',
        RESOURCES: root + 'angular/app/',
        SERVER: root + 'server/'
    };
})());