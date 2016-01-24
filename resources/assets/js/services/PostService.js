angular.module('PostService', []).factory('Post', ['$resource',
    function ($resource) {
        return $resource('/api/post/:postId', {
            postId: '@id'
        }, {
            'query': {
                method: 'GET',
                isArray: false
            },
            update: {
                method: 'PUT'
            }
        });
    }
]);