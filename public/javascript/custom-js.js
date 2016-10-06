function getAndDisplayPics(scope, http, state, timeout, url) {
    http.get(url)
        .success(function (data) {
            if (data == 'no-pics') {
                console.log(data);
                alert('warning', 'No one added any pics yet', '', 3500);
            } else {
                scope.pics = [];
                scope.pics.imgloaded = function () {
                    scope.imagesLoaded += 1;
                }
                console.log(data);
                data.forEach(function (obj) {
                    timeout(function () {
                        scope.pics.push(obj);
                    }, data.indexOf(obj) * 300);
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