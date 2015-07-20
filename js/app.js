var plpApp = angular.module('plpApp', ['ngRoute']);

// ===== Controllers =====
plpApp.controller('mainController', function($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$routeParams = $routeParams;
  $scope.$location = $location;
  
  $scope.title = "Home";
  
  $scope.setTitle = function(title) {
    $scope.title = title;
  };
});

plpApp.controller('teamController', ['$scope', '$routeParams', 'getTeams', function($scope, $routeParams, getTeams) {
  $scope.params = $routeParams;
  
  getTeams.success(function(data) {
    $scope.teams = data;
  });
  
  $scope.selectedTeam = undefined;
  
  $scope.selectTeam = function(index) {
    if ($scope.selectedTeam == index)
      $scope.selectedTeam = undefined;
    else
      $scope.selectedTeam = index;
    $scope.title = "team";
  };
}]);

// ===== Factories =====
plpApp.factory('getTeams', function($http) { 
  return $http.get('http://localhost:1337/team') 
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
plpApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/team', {
    templateUrl: 'pages/team.html',
    controller: 'teamController'
  })
  .otherwise({
    redirectTo: '/'
  })
  
  $locationProvider.html5Mode(true);
});
