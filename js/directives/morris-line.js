angular.module("app").directive('morrisLine', function () {
    return {
        restrict: 'C',
        link: function ($scope, elem, attr) {
            var data = $scope[attr.data],
                xkey = $scope[attr.xkey],
                ykeys = $scope[attr.ykeys],
                labels = $scope[attr.labels];

            Morris.Line({
                element: elem,
                data: data,
                xkey: xkey,
                ykeys: ykeys,
                labels: labels
            });
        }
    };
});