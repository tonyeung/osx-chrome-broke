angular.module("app")
    .controller('SampleMorrisBarController', function ($scope) {
        $scope.xkey = 'range';

        $scope.ykeys = ['total_tasks', 'total_overdue'];

        $scope.labels = ['Total Tasks', 'Out of Budget Tasks'];

        $scope.myModel = [
          { range: 'January', total_tasks: 20, total_overdue: 5 },
          { range: 'February', total_tasks: 35, total_overdue: 8 },
          { range: 'March', total_tasks: 20, total_overdue: 1 },
          { range: 'April', total_tasks: 20, total_overdue: 6 }
        ];
    });