angular.module('EventosService', []).factory('Eventos', ['$resource',
    function ($resource) {
        return $resource('/api/eventos/:userId', {
            userId: '@id'
        }, {
            'get': {
                method: 'GET',
                isArray: true
            },
            update: {
                method: 'PUT',
                url: '/api/eventos/update/'
            }
        });
    }
]).service('serviceEventos', function ($http, $q) {
    // implementation
    this.getEventos = function (user) {
        var def = $q.defer();
        var conf = {
            url: '/api/eventos/' + user,
        };
        return $http(conf).success(function (data) {
            def.resolve(data);
        }).error(function () {
            def.reject("Error consultando los eventos");
        });
        return def.promise;
    };

    this.getProximos = function (user) {
        var def = $q.defer();
        var conf = {
            method: 'GET',
            url: 'api/eventos/proximos/',
            params: {
                'userId': user
            }
        };
        return $http(conf).success(function (data) {
            def.resolve(data);
        }).error(function () {
            def.reject("Error consultando tus proximos eventos");
        });
        return def.promise;
    };
        
    this.getAsistidos = function (user) {
        var def = $q.defer();
        var conf = {
            method: 'GET',
            url: 'api/eventos/asistidos/',
            params: {
                'userId': user
            }
        };
        return $http(conf).success(function (data) {
            def.resolve(data);
        }).error(function () {
            def.reject("Error consultando los eventos asistidos");
        });
        return def.promise;
    };

})
