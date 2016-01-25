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
]).factory('socket', function ($rootScope) {
    var socket = io.connect('http://127.0.0.1:3000/');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
})
$(document).on('ready', function () {
    $(".button-collapse").sideNav();
    $('.tooltipped').tooltip({delay: 50});
});