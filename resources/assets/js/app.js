angular.module('campApp', [
    'ngRoute',
    'ngResource',
    'ngStorage',
    'appRoutes',
    //'enterStroke',
    'MainController',
    'PostController',
    'PostService',
    'UserController',
    'UserService',
    'DashboardController',
    'BoardService',
    'GeoController',
    'FotosController',
    'FotosService',
    'CalendarCtrl',
    'EventosService'
])
$(document).on('ready', function () {
    $(".button-collapse").sideNav();
    $('.tooltipped').tooltip({delay: 50});
});