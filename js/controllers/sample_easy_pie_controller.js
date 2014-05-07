angular.module("app")
    .controller('SampleEasyPieController', function ($scope) {
        $scope.percent = 65;
        $scope.options = {
            animate: {
                duration: 2000,
                enabled: true
            },
            trackColor: "#515151",
            scaleColor: "#515151",
            barColor: function (percent) {
                percent /= 100;
                return "rgb(" + Math.round(255 * (1 - percent)) + ", " + Math.round(255 * percent) + ", 0)";
            },
            lineCap: 'butt',
            lineWidth: 20,
            size: 150
        };
    });