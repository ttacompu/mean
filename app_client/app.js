(function () {

    angular.module('loc8rApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

    var updateCoordInit = function ($http, loc8rData, geolocation, url) {
        var position = geolocation.getPosition(function (position) {
            var lat = position.coords.latitude, lng = position.coords.longitude;
            var increaseLat = 0.000000001;
            loc8rData.locationByCoords(lat, lng)
                .success(function (data) {
                    if (!data.length) {
                        $http.post(url, {
                            name: "Starcups", address: "125 High Street, Reading, RG6 1PS",
                            facilities: ' Hot drinks,Food,Premium wifi', lng: lng, lat: lat,
                            days1: "Monday - Friday", opening1: "7:00am", closing1: "7:00pm", closed1: "false"
                        }).then(function () {
                            console.log("record added!!!");
                        });

                    }

                });

        });

    }

    angular.module('loc8rApp').run(['$http', 'loc8rData', 'geolocation', function ($http, loc8rData, geolocation) {
        var env = "";

        if (env === "production") {
            updateCoordInit($http, loc8rData, geolocation, 'https://vast-journey-36480.herokuapp.com/api/locations');
        } else {
           updateCoordInit($http, loc8rData, geolocation, 'http://localhost:3000/api/locations');
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
