(function () {
    angular
        .module('loc8rApp')
        .controller('navigationCtrl', navigationCtrl);
    navigationCtrl.$inject = ['$location', '$window', 'authentication'];
    function navigationCtrl($location, $window, authentication) {
        var vm = this;
        vm.currentPath = $location.path();
        vm.isLoggedIn = authentication.isLoggedIn();
        vm.currentUser = authentication.currentUser();
        vm.logout = function () {
            authentication.logout();
            $location.path('/');
            $window.location.reload();
        };


    }
})();