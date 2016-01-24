angular.module('FotosService', []).factory('Foto', ['$resource',
    function ($resource) {
        return $resource('/api/foto/:userId', {
            userId: '@id'
        }, {
            'getFotos': {
                method: 'GET',
                isArray: true
            },
        });
    }
]);
