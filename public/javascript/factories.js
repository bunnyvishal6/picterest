angular.module('picterest')
    /**authToken factory */
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
                cachedToken = null;
                storage.removeItem('userToken');
            }
        }
        return authToken;
    }])
    /**Auth interceptor to push auth token to header or every request made to api */
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