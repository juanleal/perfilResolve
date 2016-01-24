angular.module('BoardService', []).factory('Board', ['$resource',
  function ($resource) {
    return $resource('/api/perfil/', {
      userId: '@id'
    }, {
      update: {
        method: 'PUT'
      },
      login: {
        method: 'POST',
        url: '/api/user/login'
      },
      getByToken: {
        method: 'GET',
        url: '/api/user/getByToken'
      }
    });
  }
]);
