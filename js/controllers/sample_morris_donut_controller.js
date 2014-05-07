angular.module("app")
    .controller('SampleMorrisDonutController', function ($scope) {
        $scope.myModel = [
            { label: "Internet Sales", value: 12 },
            { label: "Walk Up Sales", value: 30 },
            { label: "Outside Sales", value: 20 }
        ];
    });