angular.module('picterest')
    .factory('authToken', ['$window', function ($window) {
        var storage = $window.localStorage;
        var cachedToken;
        var authToken = {
            setToken: function (token) {
                cachedToken = token;
                storage.setItem('userToken', token);
            },
            getToken: function () {
                if (!cachedToken) {
                    cachedToken = storage.getItem('userToken');
                }
                return cachedToken;
            },
            isAuthenticated: function () {
                return !!authToken.getToken();
            },
            removeToken: function () {
                console.log('destroyToken is called');
                cachedToken = null;
                storage.removeItem('userToken');
            }
        }
        return authToken;
    }])

    .factory('authInterceptor', ['authToken', function (authToken) {
        return {
            request: function (req) {
                var token = authToken.getToken();
                if (token) {
                    req.headers.Authorization = token;
                }
                return req;
            },
            response: function (response) {
                return response
            }
        }
    }]);