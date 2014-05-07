
angular.module("app").config(function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);
    
  $routeProvider.when('/login', {
    templateUrl: '/templates/login.html',
    controller: 'LoginController'
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});
