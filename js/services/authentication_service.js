angular.module("app").factory('AuthenticationService', function($http, $cookies, authService, API_PATH) {
    return {
        login: function (credentials) {
            return $http.post(API_PATH + 'login', credentials, { ignoreAuthModule: 'ignoreAuthModule' }).
                then(function (message) {
                    $cookies.token = message.data.Token || "";

                    var username = credentials.Username || "";
                    var dealerCode = credentials.DealerCode || "";
                    var defaultLocation = message.data.DefaultLocation || "";
                    if (username !== "" && dealerCode !== "") {
                        $cookies.username = username + ":" + dealerCode + ":" + defaultLocation;
                    }
                    
                    authService.loginConfirmed();

                    return message;
                });
        },
        logout: function() {
            return $http.post('/logout');
        },
        isAuthorizedRoute: function (requestedRoute) {
            return true;
        },
        setLocation: function (location) {
            $cookies.username = $cookies.username + location;
        }
    };
});
