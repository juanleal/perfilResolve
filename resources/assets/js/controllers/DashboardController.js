angular.module('DashboardController', []).controller('DashboardController', ['$scope', 'Board', '$localStorage', '$location',
    function ($scope, Board, $localStorage, $location) {
        /**
         * Carga el dashboard para el usuario logueado
         * @returns {undefined}
         */
        $scope.board = function () {
            var splitPath = $location.path().split('/');
            var userUrl = splitPath[splitPath.length - 1];
            $scope.board = Board.get({userUrl: userUrl});
            
            $(document).ready(function () {
                $('.slider').slider({full_width: true});
            });
        };
    }
]);

