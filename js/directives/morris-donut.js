angular.module("app").directive('morrisDonut', function () {
    return {
        restrict: 'C',
        link: function ($scope, elem, attr) {
            var data = $scope[attr.data];

            Morris.Donut({
                element: elem,
                data: data
            });
        }
    };
});