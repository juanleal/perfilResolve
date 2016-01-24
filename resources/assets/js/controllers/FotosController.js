angular.module('FotosController', [])
        .controller('FotosController', ['$scope', 'Foto', '$localStorage', '$location', '$route',
            function ($scope, Foto, $localStorage, $location, $route) {
                /*
                 * Guarda una foto del usuario
                 * @returns {undefined}
                 */
                $scope.create = function () {
                    if ($scope.addFoto.$valid) {
                        var foto = new Foto({
                            imagen: this.newFoto,
                            user_id: $scope.authenticatedUser.id
                        });
                        foto.$save(function (foto) {
                            $scope.nameFile = null;
                            $scope.newFoto = null;
                            $('#modalAdd').closeModal();
                            $scope.refFotos();
                        }, function (err) {
                            toastr.error('Ups!, hubo un error!');
                            console.log(err);
                        });
                    }
                };
                /*
                 * refresca las fotos una vez se guardan
                 * @returns {undefined}
                 */
                $scope.refFotos = function () {
                    //window.location.reload();
                    toastr.options.onShown = function () {
                        $route.reload();
                    }
                    toastr.success('Tú foto se agregó!');
                };
                
                /*
                 * Consulta las fotos del usuario
                 * @returns {undefined}
                 */
                $scope.getFotos = function () {
                    /*var splitPath = $location.path().split('/');
                     var userId = splitPath[1];*/
                    Foto.getFotos({userId: $scope.authenticatedUser.id}, function (data) {
                        $scope.fotos = data;
                        $scope.authenticatedUser.fotos = $scope.fotos.length;
                        // success handler
                    }, function (error) {
                        toastr.error('Ups!, no te podemos cargar las fotos!');
                        console.log(error);
                        if (error.status === 401 || error.status === 500) {
                            $location.path('/auth/login');
                            $location.replace();
                        }
                    });
                };

                $scope.viewLoaded = function () {
                    $('.slider').addClass('fullscreen');
                };
            }
        ]) //esta es una directiva para manipular archivos
        .directive('appFilereader', function (
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

                    });

                }

            };

        })//verifica si se termino un ng-repeat para bindear con el slider de las fotos para el efecro
        .directive('myRepeatDirective', function () {
            return function (scope, element, attrs) {
                if (scope.$last) {
                    $('.slider').slider();
                }
            };
        })//le da formato al mensaje del numero de fotos
        .filter('numeroFotos', function () {
            return function (input) {
                return input > 1 ? input + ' fotos' : input + ' foto';
            };
        });