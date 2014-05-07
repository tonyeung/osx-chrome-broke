angular.module("app").controller('LoginController', function ($scope, $location, $routeParams, $modal, AuthenticationService) {
    var returnUrl = $routeParams.returnUrl || "";
    
    $scope.credentials = {};
    $scope.loginFailed = false;

    $scope.login = function() {
        AuthenticationService.login($scope.credentials)
            .then(function (message) {
                if (message.data.DefaultLocation === undefined || message.data.DefaultLocation === "") {
                    var modalInstance = $modal.open({
                        templateUrl: 'chooseLocation.html',
                        controller: 'ChooseLocationController',
                        backdrop: 'static',
                        resolve: {}
                    });
                }
                else {
                    if (returnUrl) {
                        $location.path(returnUrl);
                    }
                    else {
                        $location.path('/dashboards');
                    }
                }
            }, function (error) {
                $scope.loginFailed = true;
            });
    };
});

angular.module("app").controller('ChooseLocationController', function ($scope, $modalInstance, AuthenticationService) {
    $scope.location = {};

    $scope.submit = function () {
        AuthenticationService.setLocation($scope.location.name);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        AuthenticationService.logout();
        $modalInstance.dismiss('cancel');
    };
});