angular.element(document).ready(function () {
    var app = angular.module("app");
    
    app.constant("API_PATH", "http://localhost:16691/");
    app.constant("HUB_PATH", "http://localhost:1333");
    app.constant("REQUEST_LIST", []);

    angular.bootstrap(document, ["app"]);
});