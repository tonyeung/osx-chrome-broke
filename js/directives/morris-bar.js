angular.module("app").directive('morrisBar', function () {
    return {
        restrict: 'C',
        link: function ($scope, elem, attr) {
            //var data = angular.fromJson(attr.sparkdata);
            var data = $scope[attr.data],
                xkey = $scope[attr.xkey],
                ykeys = $scope[attr.ykeys],
                labels = $scope[attr.labels];

            Morris.Bar({
                element: elem,
                data: data,
                xkey: xkey,
                ykeys: ykeys,
                labels: labels
            });
        }
    };
});