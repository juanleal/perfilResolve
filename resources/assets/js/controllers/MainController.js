angular.module('MainController', []).controller('MainController', ['$scope', '$location', '$localStorage', 'User',
    function ($scope, $location, $localStorage, User) {
        /**
         * Responsible for highlighting the currently active menu item in the navbar.
         *
         * @param route
         * @returns {boolean}
         */
        $scope.isActive = function (route) {
            return route === $location.path();
        };

        /**
         * Query the authenticated user by the Authorization token from the header.
         *
         * @param user {object} If provided, it won't query from database, but take this one.
         * @returns {null}
         */
        $scope.getAuthenticatedUser = function (user) {
            if (user) {
                $scope.authenticatedUser = user;
                return;
            }

            if (typeof $localStorage.token === 'undefined') {
                return null;
            }

            new User().$getByToken(function (user) {
                $scope.authenticatedUser = user;
            }, function (err) {
                toastr.error('Ups!, se ha vencido tu sesión!');
                $scope.logout();
                if (err.status === 401 || err.status === 500) {
                    $location.path('/auth/login');
                    $location.replace();
                }
            });
        };

        /*
         * Cierra sesión
         */
        $scope.logout = function () {
            delete $localStorage.token;
            $scope.authenticatedUser = null;
            $location.path('/auth/login');
            $location.replace();
        };
    }
])      //capitaliza un texto (nombre)
        .filter('capitalize', function () {
            return function (input, all) {
                var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
                return (!!input) ? input.replace(reg, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }) : '';
            }
        });
