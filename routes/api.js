var express = require('express'),
    app = express(),
    passport = require('passport'),
    User = require('../models/user'),
    Pic = require('../models/pic'),
    router = express.Router();

//get the config file
var config = require('../config/config');

//get passport config
require('../config/passport')(passport);

//post signup
router.post('/signup/local', function (req, res) {
    if (!req.body.email || !req.body.username.length > 5 || !req.body.password1 || !/^[a-z]+[1-9]*0?[1-9]*$/.test(req.body.username)) {
        res.json({ message: "please send mail, username and password to register" });
    } else {
        var newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password1
        });

        //attempt to save this neUser
        newUser.save(function (err) {
            if (err) {
                return res.json(err.errmsg.split(':')[2]);
            }
            res.json("Account creation success");
        });
    }
});

//local login
router.post('/auth/login/local', function (req, res) {
    User.getAuthenticated({ email: req.body.email, password: req.body.password }, function (err, token) {
        if (err) {
            return res.json(err);
        } else if (token) {
            res.json(token);
        }
    });
});

//get all pics for public wall
router.get('/allpics', function (req, res) {
    Pic.find({}, function (err, pics) {
        if (err) {
            return res.json({message:'no-pics'});
        }
        if (pics.length > 0) {
            return res.status(200).json({message:'pics', pics:pics});
        } else {
            return res.status(200).json({message:'no-pics'});
        }
    });
});

//like a pic
router.post('/like', passport.authenticate('jwt', { session: false }), function (req, res) {
    Pic.findOne({ _id: req.body.id }, function (err, doc) {
        if (err) { return res.json(err); }
        if (doc) {
            if (doc.likes.indexOf(req.user.email) < 0) {
                doc.likes.push(req.user.email);
                doc.save(function (err) {
                    if (err) {
                        return res.json(err);
                    }
                    return res.json('success');
                });
            } else {
                doc.likes.splice(doc.likes.indexOf(req.user.email), 1);
                doc.save(function (err) {
                    if (err) {
                        return res.json(err);
                    }
                    return res.json('like-removed');
                })
            }
        } else {
            res.json('no-pic-found');
        }
    })
});

//get my pics for my wall
router.get('/mypics', passport.authenticate('jwt', { session: false }), function (req, res) {
    Pic.find({ owner: req.user.email }, function (err, pics) {
        if (err) {
            return res.json({message: 'no-pics'});
        }
        if (pics.length > 0) {
            return res.status(200).json({message: 'pics',pics: pics});
        } else {
            return res.status(200).json({message:'no-pics'});
        }
    });
});

//To add a pic in mywall
router.post('/addpic', passport.authenticate('jwt', { session: false }), function (req, res) {
    var reg = new RegExp('^https://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|jpeg|gif|png)$');
    if (reg.test(req.body.url)) {
        var newPic = new Pic({
            owner: req.user.email,
            ownerUsername: req.user.username,
            title: req.body.title,
            picUrl: req.body.url,
            likes: []
        });
        newPic.save(function (err) {
            if (err) {
                return res.json(err);
            }
            res.json("success");
        });
    } else {
        res.json('Your url does not end with jpg or png or gif');
    }
});

//get profilepic for user wall
router.get('/getmyprofile', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.user) {
        User.findOne({ email: req.user.email }, function (err, doc) {
            if (err) {
                return res.json(err);
            }
            if (doc) {
                return res.json({ name: doc.name, profilepic: doc.profilepic, username: doc.username, email: doc.email, city: doc.city, state: doc.state, country: doc.country });
            }
            return res.json("No user found");
        });
    }
});

//update profile like city, state, country and profile pic
router.post('/updatemyprofile', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.user) {
        User.findOne({ email: req.user.email }, function (err, doc) {
            if (err) {
                return res.json(err);
            }
            if (doc) {
                if (req.body.city) {
                    doc.city = req.body.city;
                }
                if (req.body.state) {
                    doc.state = req.body.state;
                }
                if (req.body.country) {
                    doc.country = req.body.country;
                }
                if (req.body.profilepic) {
                    doc.profilepic = req.body.profilepic;
                }
                doc.save(function (err) {
                    if (err) {
                        return res.json(err);
                    }
                    return res.json('success');
                });
            }
        });
    } else {
        res.json('password do not match');
    }
});

//change password from settings page
router.post('/changemypassword', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.user) {
        User.findOne({ email: req.user.email }, function (err, doc) {
            if (err) {
                return res.json(err);
            }
            if (!doc) {
                return res.json('nouserfound');
            }
            doc.comparePassword(req.body.password, function (err, match) {
                if (err) {
                    return res.json(err);
                }
                if (match) {
                    doc.password = req.body.password1;
                    doc.save(function (err) {
                        if (err) {
                            return res.json(err);
                        }
                        return res.json('success');
                    });
                } else {
                    return res.json('password do not match');
                }
            });
        });
    } else {
        res.json('password do not match');
    }
});

//remove a pic from mywall
router.post('/removemypic', passport.authenticate('jwt', { session: false }), function (req, res) {
    Pic.findOneAndRemove({ _id: req.body.id, owner: req.user.email }, function (err) {
        if (err) {
            return res.json(err);
        }

        res.json('success');
    })
});

//get user info for user wall
router.get('/users/:username', function (req, res) {
    User.findOne({ username: req.params.username }, function (err, doc) {
        if (err) { return res.json({message:'no-user'}); }
        if (doc) {
            Pic.find({ ownerUsername: req.params.username }, function (err, pics) {
                if (err) { return res.json(err); }
                if (pics.length > 0) {
                    return res.json({ message: 'pics', pics: pics, user: { username: doc.username, profilepic: doc.profilepic, city: doc.city, state: doc.state, country: doc.country } });
                } else {
                    return res.json({message: 'no-pics'});
                }
            });
        } else {
            res.json({message:'no-user'});
        }
    })
})

//export api router
module.exports = router;