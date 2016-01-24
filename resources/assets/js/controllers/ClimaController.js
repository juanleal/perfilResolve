angular.module("GeoController", ["ui.map", "ui.event"])
        .controller("GeoController", ['$scope', 'weatherService', function ($scope, weatherService) {
                $scope.lat = "0";
                $scope.lng = "0";
                $scope.accuracy = "0";
                $scope.error = "";
                $scope.model = {myMap: undefined};
                $scope.myMarkers = [];
                $scope.ciudad = "";
                $scope.estados = [];

                $scope.showResult = function () {
                    return $scope.error == "";
                }
                $scope.mapOptions = {
                    center: new google.maps.LatLng($scope.lat, $scope.lng),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.showPosition = function (position) {
                    $scope.lat = position.coords.latitude;
                    $scope.lng = position.coords.longitude;
                    codeLatLng($scope.lat, $scope.lng);
                    $scope.accuracy = position.coords.accuracy;
                    $scope.$apply();

                    var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
                    //$scope.model.myMap.setCenter(latlng);
                    $scope.myMarkers.push(new google.maps.Marker({map: $scope.model.myMap, position: latlng}));
                }

                $scope.showPositionDefault = function () {
                    $scope.lat = 4.710989;
                    $scope.lng = -74.072092;
                    codeLatLng($scope.lat, $scope.lng);
                    $scope.accuracy = 0;
                    $scope.$apply();

                    var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
                    //$scope.model.myMap.setCenter(latlng);
                    $scope.myMarkers.push(new google.maps.Marker({map: $scope.model.myMap, position: latlng}));
                }

                $scope.showError = function (error) {
                    /*switch (error.code) {
                     case error.PERMISSION_DENIED:
                     $scope.error = "User denied the request for Geolocation."
                     break;
                     case error.POSITION_UNAVAILABLE:
                     $scope.error = "Location information is unavailable."
                     break;
                     case error.TIMEOUT:
                     $scope.error = "The request to get user location timed out."
                     break;
                     case error.UNKNOWN_ERROR:
                     $scope.error = "An unknown error occurred."
                     break;
                     }
                     $scope.$apply();*/
                    $scope.showPositionDefault();
                }

                $scope.getLocation = function () {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
                    }
                    else {
                        $scope.error = "Geolocation is not supported by this browser.";
                    }
                }

                $scope.getLocation();

                function codeLatLng(lat, lng) {
                    var geocoder = new google.maps.Geocoder();
                    var latlng = new google.maps.LatLng(lat, lng);
                    geocoder.geocode({'latLng': latlng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                //formatted address
                                console.log(results[0].formatted_address);
                                //find country name
                                for (var i = 0; i < results[0].address_components.length; i++) {
                                    for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                                        //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                                        if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                            //this is the object you are looking for
                                            city = results[0].address_components[i];
                                            break;
                                        }
                                    }
                                }
                                //city data
                                $scope.ciudad = city.short_name;
                                //viewForest(weatherService.getClima({city: 'bogotá', state: 'córdoba', country: 'colombia'}));
                                weatherService.getClima({city: 'bogotá', state: 'córdoba', country: 'colombia'})
                                        .then(viewForest);
                                ;
                                //console.log(city.short_name + " " + city.long_name);
                            } else {
                                alert("No results found");
                            }
                        } else {
                            alert("Geocoder failed due to: " + status);
                        }
                    });
                }

                var gradesC = function (input) {
                    var grados = (input - 32) / 1.8;
                    if (grados % 1 != 0) {
                        grados = grados.toFixed(1);
                    }
                    return grados + '°C ';
                };


                var weatherIconMap = ['storm', 'storm', 'storm', 'lightning', 'lightning', 'snow', 'hail', 'hail',
                    'drizzle', 'drizzle', 'rain', 'rain', 'rain', 'snow', 'snow', 'snow', 'snow',
                    'hail', 'hail', 'fog', 'fog', 'fog', 'fog', 'wind', 'wind', 'snowflake',
                    'cloud', 'cloud_moon', 'cloud_sun', 'cloud_moon', 'cloud_sun', 'moon', 'sun',
                    'moon', 'sun', 'hail', 'sun', 'lightning', 'lightning', 'lightning', 'rain',
                    'snowflake', 'snowflake', 'snowflake', 'cloud', 'rain', 'snow', 'lightning'
                ];

                var weatherDiv = $('#weather'),
                        scroller = $('#scroller'),
                        location = $('p.location');

                function viewForest(r) {
                    var r = r.data;
                    var hoy = r.query.results.channel.item.condition;
                    //var hoy = r.query.results.channel.item.forecast[0];
                    //AGREGAR EL ESTADO DEL TIEMPO
                    addWeather(hoy.code, "Hoy", hoy.text + ' ' + gradesC(hoy.temp));
                    for (var i = 1; i < 3; i++) {
                        var pronosticos = r.query.results.channel.item.forecast[i];
                        addWeather(
                                pronosticos.code,
                                pronosticos.day + ', ' + pronosticos.date.replace('\d+$', ''),
                                pronosticos.text + ' ' + gradesC(pronosticos.low) + ' ' + gradesC(pronosticos.high)
                                );
                    }

                    // Add the location to the page
                    location.html(r.query.results.channel.location.city + ', <b>' + r.query.results.channel.location.country + '</b>');

                    weatherDiv.addClass('loaded');

                    // Set the slider to the first slide
                    showSlide(0);
                    ///////
                }

                function addWeather(code, day, condition) {
                    $scope.estados.push(
                            {
                                img: weatherIconMap[code],
                                day: day,
                                condition: condition,
                            }
                    );
                    /*var markup = '<li>' +
                     '<img src="../images/icons/' + weatherIconMap[code] + '.png" />' +
                     ' <span class="day">' + day + '</span> <span class="cond">' + condition +
                     '</span></li>';*/

                    //scroller.append(markup);
                }

                /* Handling the previous / next arrows */

                var currentSlide = 0;
                weatherDiv.find('a.previous').click(function (e) {
                    e.preventDefault();
                    showSlide(currentSlide - 1);
                });

                weatherDiv.find('a.next').click(function (e) {
                    e.preventDefault();
                    showSlide(currentSlide + 1);
                });


                function showSlide(i) {
                    var items = scroller.find('li');

                    if (i >= items.length || i < 0 || scroller.is(':animated')) {
                        return false;
                    }

                    weatherDiv.removeClass('first last');

                    if (i == 0) {
                        weatherDiv.addClass('first');
                    }
                    else if (i == items.length - 1) {
                        weatherDiv.addClass('last');
                    }

                    scroller.animate({left: (-i * 100) + '%'}, function () {
                        currentSlide = i;
                    });
                }

            }])
                .service('weatherService', function ($http, $q, $rootScope) {
                    var getQuery = function (location) {
                        var query = 'select * from weather.forecast where woeid in ' + '(select woeid from geo.places(1) where text="city")';

                        query = query.replace('city', location.city)
                                /*.replace('state', location.state)
                                 .replace('country', location.country)*/;
                        console.log(query);
                        return query;
                    }

                    var getUrl = function (location) {
                        var baseUrl = 'https://query.yahooapis.com/v1/public/yql?q=';
                        var query = encodeURIComponent(getQuery(location));
                        var finalUrl = baseUrl + query;
                        return finalUrl;
                    }

                    // implementation
                    this.getClima = function (location) {
                        var def = $q.defer();
                        var url = getUrl(location);
                        return $http.jsonp('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22bogot%C3%A1%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK').success(function (data) {
                            def.resolve(data);
                        }).error(function () {
                            def.reject("Failed to get albums");
                        });
                        return def.promise;
                    }

                }).factory('climaService', ['$http', '$q'],
                function climaService($http, $q) {             // interface
                    var service = getClima;
                    return service;

                    // implementation
                    function getClima() {
                        var def = $q.defer();

                        $http.jsonp('https://query.yahooapis.com/v1/public/yql?q=', {format: 'json',
                            env: 'store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
                            callback: 'JSON_CALLBACK'
                        }).success(function (data) {
                            def.resolve(data);
                        }).error(function () {
                            def.reject("Failed to get albums");
                        });
                        return def.promise;
                    }
                })