angular.module('picterest')

    .controller('MsgCtrl', ['$scope', function ($scope) {
        $scope.getMsg = null;
    }])

    .controller('SignUpCtrl', ['$scope', '$http', '$state', 'authToken', 'alert', function ($scope, $http, $state, authToken, alert) {
        if (authToken.getToken()) {
            return $state.go('mywall');
        } else {
            var newUser = '';
            $scope.submit = function () {
                console.log('signup called');
                $http.post('/api/signup/local', { name: $scope.name, email: $scope.email, username: $scope.username, password1: $scope.password1, password2: $scope.password2 })
                    .success(function (message) {
                        switch (message) {
                            case 'Account creation success':
                                alert('success', 'Ohoo! ', 'Your account created successfully, please login now to continue.', 3300);
                                console.log(message);
                                $state.go('home');
                                break;
                            case ' email_1 dup key':
                                alert('danger', 'Oops! ', 'An account already exists with this email.', 3300);
                                console.log(message);
                                break;
                            case ' username_1 dup key':
                                alert('danger', 'Sorry! ', 'This username has been taken.', 3300);
                                console.log(message);
                                break;
                            default:
                                alert('danger', 'Something bad happened. Please try again by reloading your page', '', 3500);
                                console.log(message);
                                $state.go('signup');
                                break;
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                        alert('danger', 'Something bad happened. Please try again by reloading your page', '', 3500);
                        $state.go('signup');
                    });
            }
        }
    }])

    .controller('PublicCtrl', ['$scope', '$http', '$state', 'authToken', 'alert', '$timeout', function ($scope, $http, $state, authToken, alert, $timeout) {
        getAndDisplayPics($scope, $http, $state, authToken, alert, $timeout, '/api/allpics');

        $scope.showCustomImgModal = function (pic) {
            showimgmodal(pic);
        };

        $scope.closeCustomImgModal = function () {
            closeimgmodal();
        };

        $scope.likeAPic = function (id) {
            likeapic($http, id, $scope, $state);
        };
    }])

    .controller('UserwallCtrl', ['$stateParams', '$scope', '$state', '$http', 'authToken', 'alert', '$timeout', function ($stateParams, $scope, $state, $http, authToken, alert, $timeout) {
        console.log($stateParams.username);
        getAndDisplayPics($scope, $http, $state, authToken, alert, $timeout, '/api/users/' + $stateParams.username);

        $scope.showCustomImgModal = function (pic) {
            showimgmodal(pic);
        };

        $scope.closeCustomImgModal = function () {
            closeimgmodal();
        };

        $scope.likeAPic = function (id) {
            likeapic($http, id, $scope, $state);
        }
    }])

    .controller('LoginCtrl', ['$scope', '$http', '$state', 'authToken', 'alert', function ($scope, $http, $state, authToken, alert) {
        if (authToken.getToken()) {
            $state.go('mywall');
        } else {
            $scope.user = {};
            $scope.login = function () {
                console.log('login called');
                $http.post('/api/auth/login/local', $scope.user)
                    .success(function (data) {
                        if (data.message) {
                            alert('danger', 'Oops! ', data.message);
                            return $state.go('home');
                        } else {
                            authToken.setToken(data.token);
                            return $state.go('mywall');
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                        alert('danger', 'Something bad happened. Please try again', '', 3500);
                        return $state.go('home');
                    });
            }
        }
    }])

    .controller('NavCtrl', ['$scope', '$state', 'authToken', function ($scope, $state, authToken) {
        $scope.isAuthenticated = authToken.isAuthenticated;
        $scope.state = function () {
            return $state.current.name;
        }
    }])

    .controller('MyWallCtrl', ['$scope', '$timeout', '$http', '$state', 'authToken', 'alert', function ($scope, $timeout, $http, $state, authToken, alert) {
        if (!authToken.getToken()) {
            console.log("your are not logged in");
            return $state.go('home');
        } else {
            getAndDisplayPics($scope, $http, $state, authToken, alert, $timeout, '/api/mypics');

            $scope.showCustomImgModal = function (pic) {
                showimgmodal(pic);
            };

            $scope.closeCustomImgModal = function () {
                closeimgmodal();
            };

            $scope.getAddNewPic = function () {
                $(".custom-modal").addClass("make-background-dim");
                $("#myModal").css("display", "block");
                $("#myModal").removeClass('throw-up-modal');
            };

            $scope.cancelAddNewPic = function () {
                $(".custom-modal").removeClass("make-background-dim");
                $("#myModal").removeClass('drop-in-modal');
                $("#myModal").addClass('throw-up-modal');
                setTimeout(function () {
                    $("#myModal").css("display", "none");
                }, 400);
                $("#add-pic-img-url").val("");
                $("#add-pic-img-title").val("");
                $("#add-pic-img").attr("src", "");
            };

            $scope.newPic = {};
            $scope.addNewPic = function () {
                $http.post('/api/addpic', $scope.newPic)
                    .success(function (msg) {
                        if (msg == 'success') {
                            $scope.cancelAddNewPic();
                            $http.get('/api/mypics')
                                .success(function (data) {
                                    $scope.pics.push(data[data.length - 1]);
                                    alert('success', 'Ohoo! ', 'Your new pic added successfully to your wall', 4000);
                                })
                                .error(function (err) {
                                    alert('danger', 'Something bad happened. Please try again', '', 3500);
                                    console.log(err);
                                    $state.go('home');
                                })
                        } else {
                            $scope.cancelAddNewPic();
                            alert('danger', 'Oops! ', 'Something bad happened, please try again');
                        }
                    })
                    .error(function (err) {
                        $scope.cancelAddNewPic();
                        alert('danger', 'Oops! ', 'Something bad happened, please try again');
                        $state.go('mywall');
                    });
            }

            $scope.removePic = function (id) {
                $http.post('/api/removemypic', { id: id })
                    .success(function (msg) {
                        $scope.pics.forEach(function (val) {
                            if (val._id === id) {
                                $scope.pics.splice($scope.pics.indexOf(val), 1);
                                alert('success', '', 'You have successfully removed a pic from your wall.', 3000);
                                $state.go('mywall', {}, { reload: true });
                            }
                        })
                    })
                    .error(function (err) {
                        console.log(err);
                    })
            }
        }
    }])

    .controller('SettingsCtrl', ['$scope', '$state', '$http', 'alert', 'authToken', function ($scope, $state, $http, alert, authToken) {
        if (!authToken.getToken()) {
            console.log("your are not logged in");
            return $state.go('home');
        } else {
            function updateProfilePage(http, scope, state, url) {
                http.get(url)
                    .success(function (data) {
                        scope.name = data.name;
                        scope.email = data.email;
                        scope.username = data.username;
                        if (data.profilepic) {
                            scope.profilepic = data.profilepic;
                        } else {
                            scope.profilepic = 'https://i.imgur.com/GEjNHUo.png';
                        }
                        scope.cityPlaceholder = data.city ? data.city : 'City';
                        scope.statePlaceholder = data.state ? data.state : 'State';
                        scope.countryPlaceholder = data.country ? data.country : 'Country';
                    })
                    .error(function (err) {
                        if (err == 'Unauthorized') {
                            alert('danger', 'Session expired', '', 3500);
                            state.go('home');
                        } else {
                            console.log('err called');
                            scope.name = 'your name';
                            scope.profilepic = 'https://i.imgur.com/GEjNHUo.png';
                            scope.email = 'your email';
                            scope.username = 'Your username';
                            scope.cityPlaceholder = 'City';
                            scope.statePlaceholder = 'State';
                            scope.countryPlaceholder = 'Country';
                        }
                    });
            }

            function profileUpdateFailed() {
                alert('danger', '', 'Sorry your profile update failed', 3500);
                $state.go('settings', {}, { reload: true });
            }

            function updatemyprofile(http, state, url, obj) {
                http.post(url, obj)
                    .success(function (msg) {
                        if (msg == 'success') {
                            updateProfilePage($http, $scope, $state, '/api/getmyprofile');
                            alert('success', '', 'your profile updated successfully!', 3000);
                            state.go('settings', {}, { reload: true });
                        } else {
                            profileUpdateFailed();
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                        profileUpdateFailed();
                    });
            }

            $scope.getUpdateModal = function () {
                $(".custom-modal").addClass("make-background-dim");
                $("#profilePicModal").css("display", "block");
                $("#profilePicModal").removeClass('throw-up-modal');
            };

            $scope.cancelUpdateProPic = function () {
                $(".custom-modal").removeClass("make-background-dim");
                $("#profilePicModal").removeClass('drop-in-modal');
                $("#profilePicModal").addClass('throw-up-modal');
                setTimeout(function () {
                    $("#profilePicModal").css("display", "none");
                }, 400);
                $("#profile-img-url").val("");
                $("#update-pro-pic-src").attr("src", "");
            };

            updateProfilePage($http, $scope, $state, '/api/getmyprofile');

            $scope.updateProfilePic = function () {
                updatemyprofile($http, $state, '/api/updatemyprofile', { profilepic: $scope.url });
            }

            $scope.updateProfile = function () {
                updatemyprofile($http, $state, '/api/updatemyprofile', { city: $scope.city, state: $scope.state, country: $scope.country });
            };

            $scope.changePassword = function () {
                $http.post('/api/changemypassword', { password: $scope.password, password1: $scope.password1, password2: $scope.password2 })
                    .success(function (msg) {
                        if (msg === 'success') {
                            alert('success', 'Your password changed successfully.', '', 3000);
                            $state.go('settings', {}, { reload: true });
                        } else {
                            alert('danger', '', 'Your current password is incorrect.', 3000);
                            $state.go('settings', {}, { reload: true });
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                        profileUpdateFailed();
                    });
            };
        }
    }])

    .controller('LogoutCtrl', ['authToken', '$state', 'alert', function (authToken, $state, alert) {
        authToken.removeToken();
        alert('success', 'You have logged out successfully.', ' ', 3000);
        return $state.go('home');
    }]);