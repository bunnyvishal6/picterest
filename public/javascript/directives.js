angular.module('picterest')
    /**directive for validating passwords */
    .directive('validateEquals', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                function validateEqual(value) {
                    var valid = (value === scope.$eval(attrs.validateEquals));
                    ngModelCtrl.$setValidity('equal', valid);
                    return valid ? value : undefined;
                }
                ngModelCtrl.$parsers.push(validateEqual);
                ngModelCtrl.$formatters.push(validateEqual);
                scope.$watch(attrs.validateEquals, function () {
                    ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
                });
            }
        };
    })
    /**directive for masonry grid to load after all the images are added to the array*/
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        };
    })
    /**directive for image not available */
    .directive('onErrorSrc', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('error', function () {
                    if (attrs.src != attrs.onErrorSrc) {
                        attrs.$set('src', attrs.onErrorSrc);
                    }
                });
            }
        }
    });