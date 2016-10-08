/**To get pics and serve used in mywall, publicwall and userwall controllers.*/
function getAndDisplayPics(scope, http, state, authToken, alert, timeout, url) {
    http.get(url)
        .success(function (data) {
            if (data.message == 'no-pics') {
                alert('warning', 'No pic has been added yet', '', 3500);
            } else if(data.message == 'no-user'){
                state.go('nouser');
            } else {
                scope.pics = [];
                scope.currentUser = data.user;
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
                    $('.grid').imagesLoaded().progress(function () {
                        $('.grid').masonry('reloadItems');
                        buildMasonry();
                    });
                });
            }
        })
        .error(function (err) {
            if (err == 'Unauthorized') {
                authToken.removeToken();
                alert('danger', 'Session expired.', 'Please login again.', 3500);
                state.go('home');
            }
        });
}

/**To like pic from public wall and user wall */
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

/**open image modal on user wall, public wall and mywall */
function showimgmodal(pic) {
    $('#custom-image-modal').addClass('dim-class');
    $('#custom-image-modal').css('display', 'block');
    $('#modal-img').attr('src', pic.picUrl);
    $('#caption > h3 > span').html(pic.title);
    $('#caption > h4 > span').html(pic.likes.length);
    $('#caption > h4 > a').attr('href', '/users/'+ pic.ownerUsername);
    $('#caption > h4 > a').html(pic.ownerUsername);
}

/**Close image modal on user wall, public wall and mywall */
function closeimgmodal(){
    $("#custom-image-modal").css('display', "none");
    $('#modal-img').attr('src', '');
    $('#caption > h3 > span').html("");
    $('#caption > h4 > span').html("");
    $('#caption > h4 > a').attr('href', '');
    $('#caption > h4 > a').html("");
}