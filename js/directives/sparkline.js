angular.module("app").directive('sparkline', function () {
    return {
        restrict: 'C',
        scope: {
            sparkdata: '@',
            sparkoptions: '@'
        },
        link: function (scope, elem, attr) {
            var data = angular.fromJson(attr.sparkdata);
            var options = angular.fromJson(attr.sparkoptions);
            $(elem).sparkline(data, options);
        }
    };
});