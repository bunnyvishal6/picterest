angular.module('picterest')
    /*Alert service*/
    .service('alert', ['$rootScope', '$timeout', function alert($rootScope, $timeout) {
        var alertTimeout;
        return function (type, title, message, timeout) {
            $rootScope.alert = {
                hasBeenShown: true,
                show: true,
                type: type,
                message: message,
                title: title
            };
            $timeout.cancel(alertTimeout);
            alertTimeout = $timeout(function () {
                $rootScope.alert.show = false;
            }, timeout || 2500);
        }
    }]);