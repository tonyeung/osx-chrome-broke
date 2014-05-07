angular.module('ui.changedValue', [])
    .directive('changedValue', function () {
        'use strict';
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                changedValue: '&'
            },
            link: function (scope, element, attr, ctrl) {
                // make sure that each keystroke does not trigger a call just a change in value
                element.unbind('input').unbind('keydown').unbind('change');

                // on blur, update the value in scope
                element.bind('propertychange blur paste', function () {
                    scope.$apply(checkValue);
                });
                function checkValue() {
                    if (!angular.equals(ctrl.$viewValue, element.val())) {
                        console.log('value changed, new value is: ' + element.val());
                        ctrl.$setViewValue(element.val());
                        if (typeof (scope.changedValue) === 'function')
                            scope.changedValue();
                    }
                }
            }
        };
    });