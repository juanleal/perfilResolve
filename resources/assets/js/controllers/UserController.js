angular.module('UserController', ['infinite-scroll']).controller('UserController', ['$scope', 'User', '$localStorage', '$location',
    function ($scope, User, $localStorage, $location) {
        /*
         * hace loguin a la app
         * @returns {undefined}
         */
        $scope.login = function () {
            if ($scope.loginForm.$valid) {
                var user = new User({
                    email: this.email,
                    password: this.password
                });
                user.$login(function (user) {
                    $localStorage.token = user.token;
                    $scope.getAuthenticatedUser(user);
                    $location.path(user.url);
                }, function (err) {
                    toastr.error('Ups!, no puedes ingresar!');
                    console.log(err);
                    $scope.error = err.data;
                });
            }
        };

        /*
         * Crea un usuario en la app
         * @returns {unresolved}
         */
        $scope.create = function () {
            if ($scope.registerForm.$valid) {
                if (this.password != this.passwordConfirmation) {
                    return alert('Las contraseñas no coinciden.');
                }
                var user = new User({
                    nombre: this.nombre,
                    apellidos: this.apellidos,
                    email: this.email,
                    password: this.password,
                    fecha: this.fecha
                });
                user.$save(function (user) {
                    $localStorage.token = user.token;
                    $scope.getAuthenticatedUser(user);
                    $location.path(user.url + '/perfil');
                }, function (err) {
                    toastr.error('Ups!, no te pude registrar!');
                    console.log(err);
                });
            }
        };
        $scope.user = [];
        $scope.findOne = function () {
            var splitPath = $location.path().split('/');
            var userId = splitPath[1];
            User.get({userId: userId, userIn: $scope.authenticatedUser.id}, function (data) {
                $scope.user = data;
                $scope.user.fecha = new Date($scope.user.fecha);
                $scope.user.fecha.setDate($scope.user.fecha.getDate() + 1);
                $scope.visitas = $scope.user.visitas;
                // success handler
            }, function (error) {
                toastr.error('Ups!, no se cargó el perfil!');
                console.log(error);
                if (error.status === 401 || error.status === 500) {
                    $location.path('/auth/login');
                    $location.replace();
                }
            });
        };

        /*
         * Obtiene el número de visitas del perfil
         * @returns {undefined}
         */
        $scope.getVisits = function () {
            $scope.visitas = $scope.user.visitas;
        }

        /*
         * Actualiza un usuario
         * @param {type} user
         * @returns {undefined}
         */
        $scope.update = function (user) {
            console.log(user);
            user.$update(function (res) {
                $scope.authenticatedUser.url = user.url;
                $scope.authenticatedUser.nombre = user.nombre;
                $location.path(user.url + '/perfil');
                toastr.success('Tú perfil se actualizó!');

            }, function (err) {
                toastr.error('Ups!, hubo un error!')
                console.log(err);
            });
        };

        $scope.toggleClass = function () {
            $(".card, body").toggleClass("show-menu");
        };

        /*
         * Calcula la edad de un usuario
         * @param {type} birthday
         * @returns {Number}
         */
        $scope.calculateAge = function (birthday) { // birthday is a date
            var birthUser = new Date(birthday);
            var ageDifMs = Date.now() - birthUser.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        $scope.ultimo = 1;
        $scope.users = [];
        
        /*
         * Carga todos los usuarios desde el link explorar para usuarios normales
         * @returns {undefined}
         */
        $scope.findAll = function () {
            User.query({page: $scope.ultimo}, function (data) {
                //for (var i = 1; i <= $scope.users.length; i++) {
                var newData = [];
                angular.forEach(data.data, function (value, key) {
                    value.fecha = new Date(value.fecha);
                    value.fecha.setDate(value.fecha.getDate() + 1);
                    newData.push(value);
                });
                if (data.data.length > 0) {
                    $scope.users.push.apply($scope.users, newData);
                }
                $scope.ultimo = data.current_page + 1;
            }, function (error) {
                toastr.error('Ups!, no se cargaron los demás perfiles!');
                console.log(error);
                if (error.status === 401 || error.status === 500) {
                    $location.path('/auth/login');
                    $location.replace();
                }
            });
        };
        /**
         * Esta función cambia el estado de acceso de un afiliado, sólo lo puede
         * hacer el administrador
         * @param {type} $event
         * @returns {undefined}
         */
        $scope.changeEstateUser = function ($event) {
            User.update({
                id: $event.target.id,
                bloqued: $event.target.checked,
                userIn: $scope.authenticatedUser.id
            }, function (res) {
                toastr.success('Has bloquedado un usuario!')
            }, function (error) {
                if (error.status === 401) {
                    toastr.error(error.data.error);
                } else {
                    toastr.error('Ups!, hubo un error!');
                }
                console.log($event.target.checked);
                console.log(error);
            });
        };

        /*
         * Carga los usuarios que vana  ser administrados
         * @returns {undefined}
         */
        $scope.usersAdmin = function () {
            User.usersAdmin({userId: $scope.authenticatedUser.id}, function (data) {
                $scope.users = data.data;
            }, function (error) {
                toastr.error(error.data.error);
                if (error.status === 401 || error.status === 500) {
                    $location.path('/');
                    $location.replace();
                }
            });
        };
    }
]).directive('wjValidationError', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctl) {
            scope.$watch(attrs['wjValidationError'], function (errorMsg) {
                elm[0].setCustomValidity(errorMsg);
                ctl.$setValidity('wjValidationError', errorMsg ? false : true);
            });
        }
    };
}).directive('appFilereader', function (
        $q
        ) {
    /*
     made by elmerbulthuis@gmail.com WTFPL licensed
     */
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel)
                return;

            ngModel.$render = function () {
            }

            element.bind('change', function (e) {
                var element = e.target;
                if (!element.value)
                    return;

                element.disabled = true;
                $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function (values) {
                            /*if (element.multiple) ngModel.$setViewValue(values);
                             else ngModel.$setViewValue(values.length ? values[0] : null);*/
                            ngModel.$setViewValue(values.length ? values[0] : null);
                            element.value = null;
                            element.disabled = false;
                        });

                function readFile(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader()
                    reader.onload = function (e) {
                        deferred.resolve(e.target.result);
                    }
                    reader.onerror = function (e) {
                        deferred.reject(e);
                    }
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            }); //change

        } //link

    }; //return

}).filter('capitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    }
}).filter('numeroVisitas', function () {
    return function (input) {
        return input > 1 || input < 1 ? input + ' veces' : input + ' vez';
    };
});