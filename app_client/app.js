(function () {

    angular.module('loc8rApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

    var updateCoordInit = function ($http, geolocation, url) {
        var position = geolocation.getPosition(function (position) {
            var lat = position.coords.latitude, lng = position.coords.longitude;
            var increaseLat = 0.000000001;
            $http.put(url, { delta: increaseLat, lat: lat, lng: lng }).then(function () {
            })
        });

    }

    angular.module('loc8rApp').run(['$http', 'geolocation', function ($http, geolocation) {
        var env =  "";

        if (env === "production") {
            updateCoordInit($http, geolocation, 'https://vast-journey-36480.herokuapp.com/api/updateAll');
        } else {
            updateCoordInit($http, geolocation, 'http://localhost:3000/api/updateAll');
        }
    }]);

    function config($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: '/common/views/genericText.view.html',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
            .when('/location/:locationid', {
                templateUrl: '/locationDetail/locationDetail.view.html',
                controller: 'locationDetailCtrl',
                controllerAs: 'vm'


            })
            .when('/login', {
                templateUrl: '/auth/login/login.view.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: '/auth/register/register.view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/' });
        $locationProvider.html5Mode(true);
    }

    angular.module('loc8rApp').config(['$routeProvider', '$locationProvider', config]);

})();
