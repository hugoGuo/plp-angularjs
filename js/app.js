var plpApp = angular.module('plpApp', ['ui.router']);

var apiUrl = 'http://82.34.201.231/api';

// ===== Controllers =====
plpApp.controller('MainController', ['$scope', 'userFactory', function($scope, userFactory) {
  $scope.user = false;
  userFactory.me().success(function(data) {
    $scope.user = data;
  }).error(function(err) {
    console.log(err);
  });

  $scope.loginVisible = false;
  $scope.registerVisible = false;
  $scope.showLogin = function() {
    $scope.loginVisible = !$scope.loginVisible;
    $scope.registerVisible = false;
    componentHandler.upgradeDom();
  };
  $scope.showRegister = function() {
    $scope.registerVisible = !$scope.registerVisible;
    $scope.loginVisible = false;
    componentHandler.upgradeDom();
  };
  $scope.hideLoginRegister = function() {
    $scope.registerVisible = false;
    $scope.loginVisible = false;
    componentHandler.upgradeDom();
  }

  $scope.login = function() {
    userFactory.login($scope.loginUsername, $scope.loginPassword).success(function(data) {
      $scope.user = data;
      $scope.hideLoginRegister();
    }).error(function(err) {
      alert("Failed to log in (TODO: don't use alerts)");
      console.log(err);
    });
  };
  $scope.register = function() {
    userFactory.register($scope.registerUsername, $scope.registerPassword, $scope.registerEmail).success(function(data) {
      alert("Successfully registered, now log in! (TODO: don't use alerts)");
      $scope.showLogin();
    }).error(function(data) {
      alert("Failed to register (TODO: don't use alerts)");
    });
  };
}]);

plpApp.controller('TeamsController', ['$scope', 'teamFactory', function($scope, teamFactory) {
  teamFactory.getTeams().success(function(data) {
    $scope.teams = data;
  }).error(function(err) {
    $scope.message = 'Server error: Failed to load the teams';
    console.log(err);
  });
}]);

plpApp.controller('TeamController', ['$scope', '$stateParams', 'teamFactory', function($scope, $stateParams, teamFactory) {
  $scope.params = $stateParams;

  teamFactory.getTeam($scope.params.teamId).success(function(data) {
    $scope.team = data;
  }).error(function(err) {
    $scope.err = err;
  });
}]);

// ===== Factories =====
plpApp.factory('userFactory', ['$http', function($http) {
  var urlBase = '/user';
  dataFactory = {
    register: function(username, password, email) {
      return $http.post(apiUrl + urlBase + '/register', {
        username: username,
        password: password,
        email: email
      });
    },
    login: function(username, password) {
      return $http.post(apiUrl + urlBase + '/login', {
        username: username,
        password: password
      });
    },
    me: function() {
      return $http.post(apiUrl + urlBase + '/me');
    }
  }
  return dataFactory;
}]);

plpApp.factory('teamFactory', ['$http', function($http) {
  var urlBase = '/team';
  dataFactory = {
    getTeams: function() {
      return $http.get(apiUrl + urlBase);
    },
    getTeam: function(teamId) {
      return $http.get(apiUrl + urlBase + '/' + teamId);
    }
  }
  return dataFactory;
}]);

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

plpApp.directive('loginCard', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/directives/loginCard.html',
    controller: 'MainController'
  };
});

plpApp.directive('registerCard', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/directives/registerCard.html',
    controller: 'MainController'
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