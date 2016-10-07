function getAndDisplayPics(scope, http, state, authToken, alert, timeout, url) {
    http.get(url)
        .success(function (data) {
            if (data.message == 'no-pics') {
                console.log(data);
                alert('warning', 'No pic has been added yet', '', 3500);
            } else {
                scope.pics = [];
                scope.currentUser = data.user;
                /*scope.pics.imgloaded = function () {
                    scope.imagesLoaded += 1;
                }*/
                data.pics.forEach(function (obj) {
                    timeout(function () {
                        scope.pics.push(obj);
                    }, data.pics.indexOf(obj) * 300);
                });

                function buildMasonry() {
                    var $container = $('.grid').masonry();

                    $container.masonry({
                        itemSelector: '.grid-item',
                        transitionDuration: '.7s',
                        isAnimated: true
                    });
                }

                scope.$on('picsAdded', function () {
                    $('.grid').masonry();
                    /*
                    $('.grid').masonry('reloadItems');
                    buildMasonry();
                    */
                    ///*
                    $('.grid').imagesLoaded().progress(function () {
                        $('.grid').masonry('reloadItems');
                        buildMasonry();
                    });
                    //*/

                });
            }
        })
        .error(function (err) {
            console.log('error');
            console.log(err);
            if (err == 'Unauthorized') {
                authToken.removeToken();
                alert('danger', 'Session expired.', 'Please login again.', 3500);
                state.go('home');
            }
        });
}


function likeapic(http, id, scope, state) {
    http.post('/api/like', { id: id })
        .success(function (msg) {
            if (msg == 'success') {
                scope.pics.forEach(function (pic) {
                    if (pic._id == id) {
                        pic.likes.push('like');
                    }
                });
            } else if (msg == 'like-removed') {
                scope.pics.forEach(function (pic) {
                    if (pic._id == id) {
                        pic.likes.splice(0, 1);
                    }
                });
            }
        })
        .error(function (err) {
            if (err == 'Unauthorized') {
                alert('warning', 'You must be logged in to like.', 'Please login or signup and continue.', 5000);
                state.go('signup');
            }
        });
}