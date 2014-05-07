// Declare module which depends on filters, and services
angular.module('notification-interceptor', [])
// Declare an http interceptor that will signal the start and end of each request
.config(function ($provide, $httpProvider) {

    // Intercept http calls.
    $provide.factory('AMSHttpInterceptor', function ($q, $injector) {
        var $http, notificationService;
        return {
            // On request success
            request: function (config) {
                // console.log(config); // Contains the data about the request before it is sent.
                // get NotificationService via $injector because of circular dependency problem
                notificationService = notificationService || $injector.get('NotificationService');
                // let the system know a request has started
                notificationService.requestStarted();
                //if (config.headers['AMS-Loading'] === true) {
                //    notificationService.loadingStarted();
                //}
                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },

            // On request failure
            requestError: function (rejection) {
                // console.log(rejection); // Contains the data about the error on the request.

                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response success
            response: function (response) {
                // console.log(response); // Contains the data from the response.
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get NotificationService via $injector because of circular dependency problem
                    notificationService = notificationService || $injector.get('NotificationService');
                    // send a notification requests are complete
                    var updateStatus = (response.data !== undefined && response.data.status !== undefined) ? response.data.status : false;
                    var message = (response.data !== undefined && response.data.message !== undefined) ? response.data.message : '';
                    var recordsAffected = (response.data !== undefined && response.data.recordsAffected !== undefined) ? response.data.recordsAffected : 0;
                    notificationService.requestEnded(updateStatus, message, recordsAffected);
                }

                // Return the response or promise.
                return response || $q.when(response);
            },

            // On rejection failure
            rejectionError: function (rejection) {
                // console.log(rejection); // Contains the data about the error.
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get NotificationService via $injector because of circular dependency problem
                    notificationService = notificationService || $injector.get('NotificationService');
                    // send a notification requests are complete
                    var updateStatus = (rejection.data !== undefined && rejection.data.status !== undefined) ? rejection.data.status : false;
                    var message = (rejection.data !== undefined && rejection.data.message !== undefined) ? rejection.data.message : '';
                    var recordsAffected = (rejection.data !== undefined && rejection.data.recordsAffected !== undefined) ? rejection.data.recordsAffected : 0;
                    notificationService.requestEnded(updateStatus, message, recordsAffected);
                }
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

    $httpProvider.interceptors.push('AMSHttpInterceptor');
})
// declare the notification pub/sub channel
.factory('NotificationService', ['$rootScope', function ($rootScope) {
    // private notification messages
    var _START_REQUEST_ = '_START_REQUEST_';
    var _END_REQUEST_ = '_END_REQUEST_';
    var _START_LOADING_ = '_START_LOADING_';
    var _END_LOADING_ = '_END_LOADING_';

    // publish start request notification
    var requestStarted = function () {
        $rootScope.$broadcast(_START_REQUEST_);
    };
    // publish end request notification
    var requestEnded = function (updateStatus, message, recordsAffected) {
        $rootScope.$broadcast(_END_REQUEST_, updateStatus, message, recordsAffected);
    };
    // subscribe to start request notification
    var onRequestStarted = function ($scope, handler) {
        $scope.$on(_START_REQUEST_, function (event) {
            handler();
        });
    };
    // subscribe to end request notification
    var onRequestEnded = function ($scope, handler) {
        $scope.$on(_END_REQUEST_, function (event, updateStatus, message, recordsAffected) {
            handler(updateStatus, message, recordsAffected);
        });
    };

    // publish start loading notification
    var loadingStarted = function () {
        $rootScope.$broadcast(_START_LOADING_);
    };
    // publish end loading notification
    var loadingEnded = function () {
        $rootScope.$broadcast(_END_LOADING_);
    };
    // subscribe to start loading notification
    var onLoadingStarted = function ($scope, handler) {
        $scope.$on(_START_LOADING_, function (event) {
            handler();
        });
    };
    // subscribe to end loading notification
    var onLoadingEnded = function ($scope, handler) {
        $scope.$on(_END_LOADING_, function (event) {
            handler();
        });
    };

    return {
        requestStarted: requestStarted,
        requestEnded: requestEnded,
        onRequestStarted: onRequestStarted,
        onRequestEnded: onRequestEnded,

        loadingStarted: loadingStarted,
        loadingEnded: loadingEnded,
        onLoadingStarted: onLoadingStarted,
        onLoadingEnded: onLoadingEnded
    };
}])
// declare the directive that will show and hide the loading widget
.directive('loadingWidget', function (NotificationService) {
    return {
        restrict: "A",
        template: '<div id="loadingcontent" class="alert alert-info activity">' +
                        '<p id="loadingspinner">' +
                            '<img alt="Loading  Content" src="img/loaders/type5/light/32.gif" />' +
                            '<br />' +
                            '{{activity || "Loading" }} ...' +
                        '</p>' +
                    '</div>',
        link: function (scope, element) {
            var timer;
            // hide the element initially
            element.hide();

            var startLoadingHandler = function () {
                // got the loading start notification, show the element
                element.show();
            };

            var endLoadingHandler = function () {
                // got the loading end notification, hide the element
                element.hide();
            };
            // register for the loading start notification
            NotificationService.onLoadingStarted(scope, startLoadingHandler);
            // register for the loading end notification
            NotificationService.onLoadingEnded(scope, endLoadingHandler);
        }
    };
})
// declare the directive that will show and hide the loading widget
.directive('notificationWidget', ['NotificationService', '$timeout', function (NotificationService, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element) {
            var timer;
            // hide the element initially
            element.hide();

            var startRequestHandler = function () {
                // got the request start notification, show the element
                element.show();
            };

            var endRequestHandler = function (updateStatus, message, recordsAffected) {
                // got the request end notification, hide the element
                element.hide();
                scope.updateStatus = updateStatus;
                scope.errorMessage = message;
                scope.recordsAffected = recordsAffected;
                startTimer();
            };
            // register for the request start notification
            NotificationService.onRequestStarted(scope, startRequestHandler);
            // register for the request end notification
            NotificationService.onRequestEnded(scope, endRequestHandler);

            function startTimer() {
                timer = $timeout(function () {
                    $timeout.cancel(timer);
                    scope.errorMessage = '';
                    scope.updateStatus = false;
                    scope.recordsAffected = 0;
                }, 3000);
            }
        }
    };
}]);
