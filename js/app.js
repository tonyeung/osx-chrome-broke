var app = angular.module("app", [
    "ngCookies",
    "ngResource",
    "ngRoute",
    "http-auth-interceptor",
    'notification-interceptor',
    "ui.bootstrap",
    'angular-bootstrap-select',
    "xeditable",
    "resourceProvider",
    "ui.changedValue",
    "ui.tree",
    "ui.multiselect",
    "dateRangePicker",
    "ngGrid",
    "ngDragDrop",
    "easypiechart"
]);

// Error handling for long running requests
app.config(function ($provide, $httpProvider) {

    // Intercept http calls.
    $provide.factory('LoggingHttpInterceptor', function ($q, $timeout, REQUEST_LIST) {
        return {
            // On request success
            request: function (config) {
                if (config.method === "POST" || config.method === "PUT") {
                    console.log("logging request config");
                    console.log(config); // Contains the data about the request before it is sent.
                    console.log("logged request config");
                    console.log(config.headers['AMS-Signature']);

                    REQUEST_LIST.push({
                        id: config.headers['AMS-Signature'],
                        timeout_two_seconds: $timeout(function () {
                            console.log("open two seconds modal");
                            var injector = angular.element(document).injector();
                            injector.get('ModalErrorService').open();
                        }, 2000)
                    });
                    console.log("logging REQUEST_LIST");
                    console.log(REQUEST_LIST);
                    console.log("logged REQUEST_LIST");
                }

                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            }
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('LoggingHttpInterceptor');

});

/// the following config and run blocks are to setup the authorization for all requests
app.config(function ($httpProvider) {
    app.$httpProvider = $httpProvider;
    $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
        var key, result = [];
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
        }
        return result.join("&");
    });
});

//app.config([
//  '$provide', function ($provide) {
//      return $provide.decorator('$rootScope', [
//        '$delegate', function ($delegate) {
//            $delegate.safeApply = function (fn) {
//                var phase = $delegate.$$phase;
//                if (phase === "$apply" || phase === "$digest") {
//                    if (fn && typeof fn === 'function') {
//                        fn();
//                    }
//                } else {
//                    $delegate.$apply(fn);
//                }
//            };
//            return $delegate;
//        }
//      ]);
//  }
//]);

app.run(function ($rootScope) {
    $rootScope.safeApply = function (fn) {
        var phase = $rootScope.$$phase;
        if (phase === "$apply" || phase === "$digest") {
            if (fn && typeof fn === 'function') {
                $rootScope.$eval(fn);
            }
        } else {
            if (fn) {
                $rootScope.$apply(fn);
            } else {
                $rootScope.$apply();
            }
        }
    };
});

app.run(function ($cookies, $location) {
    // private functions
    var generateRequestSignature = function (username, time, secret) {
        var sig = "";

        if (username !== undefined && secret !== undefined) {
            var rawSig = username + ":" + time;
            var hash = CryptoJS.HmacSHA512(rawSig, secret);
            sig = CryptoJS.enc.Base64.stringify(hash);
        }

        return sig;
    };

    // function body
    var time = new Date().toGMTString();

    // create auth sig
    var username = $cookies.username || "";
    var secret = $cookies.token || "";
    var sig = generateRequestSignature(username, time, secret);

    // add the required header for data transfer to webapi  
    app.$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    app.$httpProvider.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded';
    app.$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    app.$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    // add the auth headers
    app.$httpProvider.defaults.headers.common['AMS-Username'] = username;
    app.$httpProvider.defaults.headers.common['AMS-Time'] = time;
    app.$httpProvider.defaults.headers.common['AMS-Signature'] = sig;

    // add the location header for tracking where the request came from
    app.$httpProvider.defaults.headers.common['AMS-Location'] = $location.path();
    
    app.$httpProvider.defaults.transformRequest = function (data) {
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    };
});
/// end authorization

/// the auth event listeners
app.run(function ($rootScope, $location, AuthenticationService) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
        if (!AuthenticationService.isAuthorizedRoute($location.path())) {
            $location.path('/login');
        }
    });

    $rootScope.$on('event:auth-loginRequired', function (event, returnUrl) {
        var redirectUrl = '/login' + returnUrl;
        $location.path(redirectUrl);
    });

    $rootScope.$on('event:auth-noAccess', function (event, returnUrl) {
        $location.path('/no-access/' + returnUrl);
    });
});
/// end auth event listeners

/// connect to the hub
/*app.run(function ($rootScope, HUB_PATH, REQUEST_LIST) {
    var commandsSent = [];

    $.connection.hub.logging = true;

    var connection = $.hubConnection(HUB_PATH);
    var proxy = connection.createHubProxy('amshub');
    proxy.on('receiveServerPush', function (message) {
        console.log("signalr event received");
        console.log(message);

        for (var i = 0; i < REQUEST_LIST.length; i++) {
            if (REQUEST_LIST[i].id === message.RequestToken) {
                REQUEST_LIST.splice(i);

                var injector = angular.element(document).injector();
                injector.get('ModalErrorService').close();

                break;
            }
        }
        console.log(REQUEST_LIST);

        if (message.ShowNotification) {
            console.log(message.LastAction);
            //amsNotifications.info(message.LastAction, message.ReadModelName);
        }

        $rootScope.$broadcast(message.ReadModelName, message);
    });

    connection.start()
        .done(function () {
            app.$httpProvider.defaults.headers.common['AMS-ClientId'] = connection.id;
            console.log('Now connected, connection ID=' + connection.id);
        })
        .fail(function (reason) {
            console.log("SignalR connection failed: " + reason);
        });

});*/
/// end hub connection

/// setup xeditable
app.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
/// end setup xeditable

/// setup array helper methods
app.run(function (UtilitiesService) {
    UtilitiesService.addArrayHelperMethods();
});
/// end setup array helper methods


