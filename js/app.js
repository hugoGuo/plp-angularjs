var plpApp = angular.module('plpApp', ['ui.router']);

var apiUrl = 'http://localhost:1337';

// ===== Controllers =====
plpApp.controller('mainController', function($scope, $location) {

});

plpApp.controller('TeamsController', ['$scope', 'getTeams', function($scope, getTeams) {
  getTeams.success(function(data) {
    $scope.teams = data;
    console.log(data);
  }).error(function(err){
    $scope.err = err;
    console.log(err);
  });
}]);

plpApp.controller('TeamController', ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http) {
  $scope.params = $stateParams;
  
  $http.get(apiUrl + '/team/' + $scope.params.teamId)
    .success(function(data){
      $scope.team = data;
    })
    .error(function(err){
      $scope.err = err;
    });
}]);

// ===== Factories =====
plpApp.factory('getTeams', function($http) { 
  return $http.get(apiUrl + '/team') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
});

// ===== Directives =====
plpApp.directive('teamCard', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      info: '=' 
    }, 
    templateUrl: 'js/directives/teamCard.html' 
  }; 
});

// ===== Config =====
plpApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise("/");
  
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'partials/home.html'
  })
  .state('teams', {
    url: '/teamlist',
    templateUrl: 'partials/teams.html',
    controller: 'TeamsController'
  })
  .state('team', {
    url: '/team/:teamId',
    templateUrl: 'partials/team.html',
    controller: 'TeamController'
  })
  
  $locationProvider.html5Mode(true);
});
